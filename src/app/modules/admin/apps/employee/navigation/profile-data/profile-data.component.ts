import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {
    selectedProductForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    console.log('profile-data');
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

}
