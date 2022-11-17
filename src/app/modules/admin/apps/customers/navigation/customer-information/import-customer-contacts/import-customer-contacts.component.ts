import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { AlertService } from 'app/core/alert/alert.service';

@Component({
  selector: 'app-import-customer-contacts',
  templateUrl: './import-customer-contacts.component.html',
  styleUrls: ['./import-customer-contacts.component.scss']
})
export class ImportCustomerContactsComponent implements OnInit {

  //#region Import Variables
  importCustomerContactList: any[] = [];
  arrayBuffer: any;
  file: File;
  fileError: string = '';
  isFileError: boolean = false;
  fileHeaders: any[] = [];
  importFileData: any;
  //#endregion

  //#region Import Function Validation
  importSchema = Joi.object({
    company_name: Joi.string(),
    customer_id: Joi.required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    website: Joi.string(),
    position: Joi.string(),
    address: Joi.string(),
    cell_number: Joi.string().max(15).required(),
    city: Joi.string(),
    office_number: Joi.string().max(15).required(),
    state: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    zip_code: Joi.string(),
    fax: Joi.string(),
    linkedin: Joi.string(),
    note_1: Joi.string(),
    note_2: Joi.string(),
    avatar: Joi.string()
  });
  //#endregion

  constructor(
    private _customersService: CustomersService,
    private _alertSerice: AlertService,
    public matDialogRef: MatDialogRef<ImportCustomerContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];

      this.importCustomerContactList = XLSX.utils.sheet_to_json(worksheet, {});
      var phoneRegex = /^(\d{0,3})(\d{0,3})(\d{0,4})/;
      this.importCustomerContactList.map((value) => {
        var cell = value.phone_number.toString();
        var office = value.phone_number.toString();
        value.phone_number = cell.replace(phoneRegex, '($1)-$2-$3');
        value.phone_number = office.replace(phoneRegex, '($1)-$2-$3');
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
        utils.sheet_add_json(ws, this.importCustomerContactList, {
          origin: 'A2',
          skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Customer Contact Report logs.xlsx');
      }
      else {
        this._customersService.customerContactImport(this.data?.customerId,this.importCustomerContactList, this.data?.limit, this.data?.sort, this.data?.order, this.data?.search);
      }
      this.saveAndClose();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importValidation() {
    this.importCustomerContactList.map(async (val, index) => {
      try {
        const value = await this.importSchema.validateAsync(val, {
          abortEarly: false,
        });
      } catch (err) {
        const message = err.details.map(i => i.message).join(',');
        this.importCustomerContactList[index].error = message;
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

  //#region close dialog
  saveAndClose(): void {
    this.matDialogRef.close();
  }
  //#endregion

}
