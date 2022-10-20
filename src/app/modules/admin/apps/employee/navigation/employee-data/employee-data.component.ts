/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss']
})
export class EmployeeDataComponent implements OnInit {
    isEditMode: boolean = false;
    selectedProductForm: FormGroup;


  constructor(
    private _formBuilder: FormBuilder,
    // public matDialogRef: MatDialogRef<EmployeeDataComponent>,

  ) { }

  ngOnInit(): void {
     // Create the selected product form
     this.selectedProductForm = this._formBuilder.group({
      fname               : [''],
      lname      : [''],
      email             : [''],
      cellnumber      : [''],
      homenumber              : [''],
      usnumber          : [''],
      address1            : [''],
      address2: [''],
      city            : [''],
      country    : [''],
      postalcode         : [''],
      sname         : [''],
      snumber             : [''],
      ename        : [''],
      enumber       : [''],

  });
  this.selectedProductForm.patchValue({
    fname               : 'Sam',
    lname      : 'John',
    email             : 's@s.com ',
    cellnumber      : '+1(123)-456-7890',
    homenumber              : '+1(123)-456-7890',
    usnumber          : '+1(123)-456-7890',
    address1            : 'Michigan Heights',
    address2:           'Michigan Heights',
    city            : 'Michigan',
    country    : 'U.S.',
    postalcode         : '54000',
    sname         : 'Lisa',
    snumber             : '000-0000-0000',
    ename        : 'Donald',
    enumber       : '000-0000-0000',

  });
  }

enableEditButton(): void
  {
    this.isEditMode = true;

  }
  disableEditButton(): void
   {
    this.isEditMode = false;
  }
}
