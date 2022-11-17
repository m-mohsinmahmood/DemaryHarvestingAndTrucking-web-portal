import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CropService } from '../crops.services';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';
import { AlertService } from 'app/core/alert/alert.service';


@Component({
  selector: 'app-import-crops',
  templateUrl: './import-crops.component.html',
  styleUrls: ['./import-crops.component.scss']
})
export class ImportCropsComponent implements OnInit {

  //#region Import Variables
  importCropList: any[] = [];
  arrayBuffer: any;
  file: File;
  fileError: string = '';
  isFileError: boolean = false;
  fileHeaders: any[] = [];
  importFileData: any;
  //#endregion

  //#region Import Function Validation
  importSchema = Joi.object({
    name: Joi.string().required(),
    variety: Joi.string(),
    bushel_weight: Joi.number().required(),

  });
  //#endregion

  constructor(
    private _cropsService: CropService,
    private _alertSerice: AlertService,
    public matDialogRef: MatDialogRef<ImportCropsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  //#region Lifecycle functions
  ngOnInit(): void {
  }

  //#endregion

  //#region Import Crops
  incomingfile(event) {
    this.file = event.target.files[0];
  }
  upload() {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.importCropList = XLSX.utils.sheet_to_json(worksheet, {});
      this.fileHeaders = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      this.fileHeaders[0].push('Errors');
      await this.importValidation();
      if (this.isFileError) {
        const headings = [this.fileHeaders[0]];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, this.importCropList, {
          origin: 'A2',
          skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Crop Report logs.xlsx');
      }
      else {
        this._cropsService.cropImport(this.importCropList);
      }
      this.saveAndClose();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importValidation() {
    this.importCropList.map(async (val, index) => {
      try {
        const value = await this.importSchema.validateAsync(val, {
          abortEarly: false,
        });
      } catch (err) {
        const message = err.details.map(i => i.message).join(',');
        this.importCropList[index].error = message;
        this.isFileError = true;
        this._alertSerice.showAlert({
          type: 'error',
          shake: false,
          slideRight: true,
          title: 'Error',
          message: 'Check file for errors',
          time: 6000,
      });
      }
    });
  }

  //#endregion

  saveAndClose(): void {
    // this._cropsService.is_loading_crop.next(false);
    this.matDialogRef.close();
  }

}
