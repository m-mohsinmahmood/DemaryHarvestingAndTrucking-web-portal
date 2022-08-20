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
  imageURL: string = '';
  previews: string[] = [];
  avatar: string = "";

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
    private _formBuilder: FormBuilder,
    public _employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
   ) {

    }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      avatar: ['', [Validators.required]],
      fname     : ['', [Validators.required]],
      lname     : ['', [Validators.required]],
      role    : ['', [Validators.required]],
      position: ['', [Validators.required]],
      email   : ['', [Validators.email]],
      address : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      emergencyContact : ['', [Validators.required]],
      bankingInfo : ['', [Validators.required]],
      salary  : ['',[]],
      currentEmployee : ['',[]]
    });

   // Get the employee by id
   this._employeeService.getEmployeeById(this.data.id).subscribe((employee) => {
   this.avatar = employee.avatar
   this.employees = employee;
   this.form.patchValue(employee);
  });

  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
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
    this.matDialogRef.close();
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
