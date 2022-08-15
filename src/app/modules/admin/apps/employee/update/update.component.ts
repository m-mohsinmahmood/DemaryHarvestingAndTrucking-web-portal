import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateComponent implements OnInit {

  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors']

  form: FormGroup;
  employees:any;

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
    private _formBuilder: FormBuilder,
    public _employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
   ) {

    }

  ngOnInit(): void {

  this.form = this._formBuilder.group({
    fname     : ['', [Validators.required]],
    lname     : ['', [Validators.required]],
    role    : ['', [Validators.required]],
    position: ['', [Validators.required]],
    email   : ['', [Validators.email]],
    salary  : ['',[]],
    currentEmployee : ['',[]],
});

   // Get the employee by id
   this._employeeService.getEmployeeById(this.data.id).subscribe((employee) => {
    console.log('UPDATE::',employee);
    this.employees = employee;
    this.form.patchValue(employee);

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
