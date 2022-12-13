import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {

  //#region email variables
  emails: any;
  email_text: string;
  form: FormGroup;
  formValid: boolean;
  copyFields: { cc: boolean; bcc: boolean } = {
    cc: false,
    bcc: false
  };
  quillModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };
  //#endregion


  constructor(
    public matDialogRef: MatDialogRef<HelpModalComponent>,
    private _formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  //#region Init Form
  initForm() {
    this.form = this._formBuilder.group({
      id: [''],
      subject: [''],
      body: ['', [Validators.required]]
    });
  }

  //#region Form Methods
  discard(): void {
    this.matDialogRef.close();
  }

  send() {

  }

  //#endregion

}
