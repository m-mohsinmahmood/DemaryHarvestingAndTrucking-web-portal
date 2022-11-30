import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { UpdateComponent } from '../../../customers/update/update.component';
import { UpdateComponent } from '../../update/update.component';

import { AddComponent } from '../../add/add.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss']
})
export class EmployeeDataComponent implements OnInit {
    isEditMode: boolean = false;
    selectedProductForm: FormGroup;
    routeID; // URL ID


  constructor(
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,


    // public matDialogRef: MatDialogRef<EmployeeDataComponent>,

  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
        this.routeID = params.Id;
    });

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

// enableEditButton(): void
//   {
//     this.isEditMode = true;

//   }

  enableEditButton(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(UpdateComponent, {
        data: { id: this.routeID },
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('Compose dialog was closed!');
    });
}
}
