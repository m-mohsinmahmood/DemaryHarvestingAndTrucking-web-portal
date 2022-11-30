import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UpdateProfileData } from './update-profile-data/update.component';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {
    selectedProductForm: FormGroup;
    isEditMode: boolean = true;
    routeID; // URL ID

  constructor(
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,

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
  }

  enableEditButton(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(UpdateProfileData, {
        data: { id: this.routeID },
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('Compose dialog was closed!');
    });
}

}
