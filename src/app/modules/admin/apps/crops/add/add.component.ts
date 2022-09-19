import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCropsComponent implements OnInit {
  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddCropsComponent>
    ) { }

  ngOnInit(): void {
    // Create the form
    this.form = this._formBuilder.group({
        crop: [''],
        variety: [''],
        bushelWeight: ['', [Validators.required]],
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
