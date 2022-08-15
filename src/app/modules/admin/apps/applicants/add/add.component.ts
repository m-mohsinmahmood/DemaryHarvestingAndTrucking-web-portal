import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors']

  form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    private _formBuilder: FormBuilder
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.form = this._formBuilder.group({
    firstName     : ['', [Validators.required]],
    lastName     : ['', [Validators.required]],
    role    : ['', [Validators.required]],
    position: ['', [Validators.required]],
    email   : ['', [Validators.email]],
    salary  : ['',[]],
    currentEmployee : ['',[]]
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
