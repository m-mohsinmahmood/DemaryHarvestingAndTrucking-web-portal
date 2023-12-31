import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'app-import-farms',
  templateUrl: './import-farms.component.html',
  styleUrls: ['./import-farms.component.scss']
})
export class ImportFarmsComponent implements OnInit {

  //#region Import Variables
  importCustomerFarmList: any[] = [];
  arrayBuffer: any;
  file: File;
  fileError: string = '';
  isFileError: boolean = false;
  isEmptyFile: boolean = false;

  fileHeaders: any[] = [];
  importFileData: any;
  //#endregion


  //#region Import Function Validation
  importSchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.boolean().required() .messages({
      'boolean.base': `"status" is not allowed to be empty'`,
    })
  });
  //#endregion

  constructor(
    private _customersService: CustomersService,
    private _alertSerice: AlertService,
    public matDialogRef: MatDialogRef<ImportFarmsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  //#region Lifecycle functions
  ngOnInit(): void {
  }

  //#endregion

  //#region Import functions
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
      const workbook = XLSX.read(bstr, { type: 'binary', sheetStubs: true });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];

      this.importCustomerFarmList = XLSX.utils.sheet_to_json(worksheet, {defval: ''});
      this.fileHeaders = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      await this.importValidation();
      if (this.isFileError) {
        const headings = [this.fileHeaders[0]];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, this.importCustomerFarmList, {
          origin: 'A2',
          skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Customer Farm logs.xlsx');
      }
      else if (!this.isEmptyFile) {
        this.importCustomerFarmList = this.importCustomerFarmList.map(v => ({...v, customer_id: this.data?.customer_id}));
        this._customersService.customerFarmImport(this.data?.customer_id,this.importCustomerFarmList, this.data?.limit, this.data?.sort, this.data?.order, this.data?.search);
      }
      this.saveAndClose();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importValidation() {
    const headers = ['name','status']; 
    if (this.importCustomerFarmList.length > 0 && JSON.stringify(headers) === JSON.stringify(this.fileHeaders[0])){
      this.fileHeaders[0].push('Errors');
      this.importCustomerFarmList.map(async (val, index) => {
        try {
          const value = await this.importSchema.validateAsync(val, {
            abortEarly: false,
          });
        } catch (err) {
          const message = err.details.map(i => i.message).join(',');
          this.importCustomerFarmList[index].error = message;
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
    else {
      this.isEmptyFile = true;
      this._alertSerice.showAlert({
        type: 'error',
        shake: false,
        slideRight: true,
        title: 'Error',
        message: 'Please upload valid file',
        time: 6000,
      });
    }
  }

  //#endregion

  //#region close dialog
  saveAndClose(): void {
    // this._cropsService.is_loading_crop.next(false);
    this.matDialogRef.close();
  }
  //#endregion
}
