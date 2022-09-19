import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

interface Food {
    value: string;
    viewValue: string;
  }

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.component.html',
  styleUrls: ['./add-farm.component.scss']
})
export class AddFarmComponent implements OnInit {
  selectedValue: string;
  form: FormGroup;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];


  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddFarmComponent>,
    ) { }

  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group({
        avatar: [null],
        name: [''],
        firstName     : ['', [Validators.required]],
        lastName     : ['', [Validators.required]],
        role    : ['', [Validators.required]],
        position: ['', [Validators.required]],
      });
  }

  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }

  saveAndClose(): void
  {
      this.matDialogRef.close();
  }


  discard(): void
  {
    this.matDialogRef.close();
  }


}
