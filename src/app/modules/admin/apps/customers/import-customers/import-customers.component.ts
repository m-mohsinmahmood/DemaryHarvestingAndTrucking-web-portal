import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'app-import-customers',
  templateUrl: './import-customers.component.html',
  styleUrls: ['./import-customers.component.scss']
})
export class ImportCustomersComponent implements OnInit {

  //#region Import Variables
  importCustomerList: any[] = [];
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
    main_contact: Joi.required(),
    position: Joi.string().optional().allow(''),
    phone_number: Joi.string().max(15).required(),
    state: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    customer_type: Joi.required(),
    status: Joi.bool(),
    customer_name: Joi.required(),
    fax: Joi.number().optional().allow(''),
    address: Joi.string().optional().allow(''),
    billing_address: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow(''),
    zip_code: Joi.number().optional().allow(''),
    website: Joi.string().optional().allow(''),
    linkedin: Joi.string().optional().allow('')
  });
  //#endregion

  constructor(
    private _customersService: CustomersService,
    private _alertSerice: AlertService,
    public matDialogRef: MatDialogRef<ImportCustomersComponent>,
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
      const workbook = XLSX.read(bstr, { type: 'binary', sheetStubs: true });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.importCustomerList = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      console.log("importCustomerList", this.importCustomerList);
      var phoneRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})/;
      this.importCustomerList.map((value) => {
        var str = value.phone_number.toString()
        value.phone_number = str.replace(phoneRegex, '($1)-$2-$3');
      })
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
        utils.sheet_add_json(ws, this.importCustomerList, {
          origin: 'A2',
          skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Crop Report logs.xlsx');
      }
      else if (!this.isEmptyFile) {
        this._customersService.customerImport(this.importCustomerList, this.data?.limit, this.data?.sort, this.data?.order, this.data?.search, this.data?.filters);
      }
      this.saveAndClose();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importValidation() {
    debugger;
    if (this.importCustomerList.length > 0){
      this.importCustomerList.map(async (val, index) => {
        try {
          const value = await this.importSchema.validateAsync(val, {
            abortEarly: false,
          });
        } catch (err) {
          const message = err.details.map(i => i.message).join(',');
          this.importCustomerList[index].error = message;
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
