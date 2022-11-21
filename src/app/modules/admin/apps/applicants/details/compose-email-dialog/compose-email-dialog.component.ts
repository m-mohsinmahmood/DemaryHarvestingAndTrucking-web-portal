import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-compose-email-dialog',
  templateUrl: './compose-email-dialog.component.html',
  styleUrls: ['./compose-email-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})



export class ComposeEmailDialogComponent implements OnInit {
  emails = [
    {id: '1',subject: '' , email: ''},
    {id: '2',subject: '' , email: ''},
    {id: '3',subject: '' , email: ''},
    {id: '4',subject: '' , email: ''},
    {id: '5',subject: '' , email: ''},
    {id: '6',subject: '' , email: ''},
    {id: '7',subject: '' , email: ''},
    {id: '8',subject: '' , email: ''},
    {id: '9',subject: '' , email: ''},

]
  composeForm: FormGroup;
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

  constructor(
    public matDialogRef: MatDialogRef<ComposeEmailDialogComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  //#region Lifecycle hooks
  ngOnInit(): void {
    // Create the form
    const { applicant } = this.data;
    this.composeForm = this._formBuilder.group({
      preliminary_review: [''],
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.email]],
      bcc: ['', [Validators.email]],
      subject: [''],
      body: ['', [Validators.required]]
    });
    this.composeForm.patchValue({
      to: applicant.first_name,
  });
  }
  //#endregion


  //#region Public Methods
  showCopyField(name: string): void {
    // Return if the name is not one of the available names
    if (name !== 'cc' && name !== 'bcc') {
      return;
    }

    // Show the field
    this.copyFields[name] = true;
  }



  discard(): void {
    this.matDialogRef.close();
  }

  send(): void {

  }

  //#endregion

}

