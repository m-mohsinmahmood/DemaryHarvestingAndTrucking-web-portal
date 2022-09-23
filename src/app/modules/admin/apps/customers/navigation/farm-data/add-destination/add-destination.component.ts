import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.scss']
})
export class AddDestinationComponent implements OnInit {
  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddDestinationComponent>
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
