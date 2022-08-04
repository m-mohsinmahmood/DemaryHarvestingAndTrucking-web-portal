import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddFarm implements OnInit {

  form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddFarm>,
    private _formBuilder: FormBuilder
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.form = this._formBuilder.group({
    id               : [''],
    harvestYear         : [''],
    name             : ['', [Validators.required]],
    alternateName      : [''],
    skipInvoiceMath1              : [''],
    arizonaInvoiceMath          : [''],
    skipInvoiceMath2            : [''],
    email           : [''],
    isActive            : [''],
});
  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }
  
   /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    send(): void
    {

    }

}
