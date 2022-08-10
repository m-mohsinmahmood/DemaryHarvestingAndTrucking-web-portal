import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent implements OnInit {

  form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddModalComponent>,
    private _formBuilder: FormBuilder
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.form = this._formBuilder.group({
    // firstName     : ['', [Validators.required]],
    // lastName     : ['', [Validators.required]],
    // role    : ['', [Validators.required]],
    // position: ['', [Validators.required]],
    // email   : ['', [Validators.email]],
    // salary  : ['',[]],
    // currentEmployee : ['',[]]
    truckname : ['', [Validators.required]],
    cmp_name: ['',[Validators.required]]
  });
  }
  
  
  
  onSubmit(): void {
  debugger;
    console.warn('Thanks for submitting:', this.form.value);
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
