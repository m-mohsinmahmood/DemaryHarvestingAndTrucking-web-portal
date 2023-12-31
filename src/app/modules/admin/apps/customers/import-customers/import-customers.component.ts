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
    main_contact: Joi.string().optional().allow(''),
    position: Joi.string().optional().allow(''),
    phone_number: Joi.string().min(1).max(15).required(),
    state: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    email: Joi.string().min(1).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    customer_type: Joi.string().min(1).required(),
    status: Joi.boolean().required() .messages({
      'boolean.base': `"status" is not allowed to be empty'`,
    }),
    customer_name: Joi.string().min(1).required(),
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
      var phoneRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})/;
      this.importCustomerList.map((value) => {
        if ( value.phone_number && value.phone_number != ""){
          var str = value?.phone_number.toString()
          value.phone_number = str.replace(phoneRegex, '($1)-$2-$3');
        } 
      })
      this.fileHeaders = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
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
        writeFile(wb, 'Customer logs.xlsx');
      }
      else if (!this.isEmptyFile) {
        this._customersService.customerImport(this.importCustomerList, this.data?.limit, this.data?.sort, this.data?.order, this.data?.search, this.data?.filters);
      }
      this.saveAndClose();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importValidation() {
    const headers =['customer_name', 'main_contact', 'position', 'phone_number', 'state', 'country', 'email', 'customer_type', 'address', 'billing_address', 'fax', 'city', 'zip_code', 'website', 'linkedin', 'status']
    if (this.importCustomerList.length > 0  && JSON.stringify(headers) === JSON.stringify(this.fileHeaders[0])){
      this.fileHeaders[0].push('Errors');
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
