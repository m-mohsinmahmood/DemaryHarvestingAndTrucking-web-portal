import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors']

  form: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
    private _formBuilder: FormBuilder,
   ) { }

  ngOnInit(): void {

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
