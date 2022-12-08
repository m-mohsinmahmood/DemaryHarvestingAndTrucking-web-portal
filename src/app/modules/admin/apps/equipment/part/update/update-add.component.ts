/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
// import { Component, OnInit } from '@angular/core';

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import moment from 'moment';


@Component({
  selector: 'app-updateadd',
  templateUrl: './update-add.component.html',
  styleUrls: ['./update-add.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateAddPartsComponent implements OnInit {

  roles: string[] = ['single', 'Married', 'Divorced'];
  stepperOrientation: Observable<StepperOrientation>;

  form: FormGroup;
  employees: any;
  flashMessage: 'success' | 'error' | null = null;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  isSubmit = false;
  isBack = false;
  imageURL: string = '';
//   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  routeID: string;
  avatar: string = '';



  constructor(
    public matDialogRef: MatDialogRef<UpdateAddPartsComponent>,
    private _formBuilder: FormBuilder,
    public _applicantService: ApplicantService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
    breakpointObserver: BreakpointObserver,
   ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 860px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    this.routeID = data?data.id: '';
    }

  ngOnInit(): void {

this.firstFormGroup = this._formBuilder.group({
  firstEmail: ['', ''],
  firstSentDate: ['', ''],
  secondEmail: ['', ''],
  secondSentDate: ['', ''],
  applicationDate: ['', ''],
  // fullName: ["", ""],

});

this.secondFormGroup = this._formBuilder.group({
  fullName: ['', ''],
  lastNameFirstName: ['', ''],
  firstName: ['', ''],
  lastName: ['', ''],
  cellPhone: ['', ''],
  homePhone: ['', ''],
  email: ['', ''],
});

this.fourthFormGroup = this._formBuilder.group({
  dob: ['', ''],
  maritalStatus: ['', ''],
  address1: ['', ''],
  address2: ['', ''],
  city: ['', ''],
  province:['',''],
  county: ['', ''],
  postalCode: ['', ''],
  country: ['', ''],
  usCitizen: ['', ''],
  license: ['', ''],
  passport: ['', ''],
//   imageURL: ['', [Validators.required]],
  avatar: ['', ''],


});

this.fifthFormGroup = this._formBuilder.group({
  firstQuestion: ['', ''],
  secondQuestion: ['', ''],
  thirdQuestion: ['', ''],
  fourthQuestion: ['', ''],
  fifthQuestion: ['', ''],
  workExperience: ['', ''],
  job: ['', ''],
  supervisor: ['', ''],
  supervisorContact: ['', ''],
});

this.sixthFormGroup = this._formBuilder.group({
  e_firstQuestion: ['', ''],
  e_secondQuestion: ['', ''],
  e_thirdQuestion: ['', ''],
});
 console.log('object',this.data);
   // Get the employee by id
// if(this.data !== null){
//     this._applicantService.getApplicantById(this.data.id).subscribe((employee) => {
//      console.log('Applicant:',employee);
//      // console.log('--',moment( employee.firstSentDate).subtract(1, 'week').hour(18).minute(56).toISOString());

//      this.firstFormGroup = this._formBuilder.group({
//       first_name: employee.first_name,
//       last_name: employee.last_name,
//       email: employee.secondEmail,
//       cell_phone_number: employee.cell_phone_number,
//       home_phone_number: employee.home_phone_number,
//       languages: employee.languages,

//     });
//     this.secondFormGroup.patchValue({
//       fullName: employee.name,
//       lastNameFirstName: employee.name,
//       first_name: employee.first_name,
//       last_name: employee.last_name,
//       cell_phone_number: employee.cell_phone_number,
//       home_phone_number: employee.home_phone_number,
//       email: employee.email,
//     });
//     this.fourthFormGroup.patchValue({
//       date_of_birth: moment(employee.date_of_birth)
//         .subtract(1, 'week')
//         .hour(18)
//         .minute(56)
//         .toISOString(),
//       marital_status: employee.marital_status,
//       address_1: employee.address_1,
//       address_2: employee.address_2,
//       city: employee.town,
//       province: employee.state,
//       postal_code: employee.postal_code,
//       country: employee.country,
//       us_citizen: employee.us_citizen,
//       tractor_license: employee.tractor_license,
//       passport: employee.passport,
//       //   imageURL: employee.imageURL,
//       avatar: employee.avatar,
//     });
//     this.fifthFormGroup.patchValue({
//       question_1: employee.question_1,
//       question_2: employee.question_2,
//       question_3: employee.question_3,
//       question_4: employee.question_4,
//       question_5: employee.question_5,
//       work_experience_description: employee.work_experience_description,
//       recent_job: employee.recent_job,
//       supervisor: employee.supervisor,
//       supervisor_contact: employee.supervisor_contact,
//     });
//     this.sixthFormGroup.patchValue({
//       degree: employee.name,
//       institution: employee.name,
//       education: employee.name,
//     });
//      this._changeDetectorRef.markForCheck();

//  });
// }else{
//     console.log('Else Called');
// }
  }

  submit(): void {
  //   console.warn('Your order has been submitted', this.form.value);
  //   // this.form.reset()


    // Remove the currentImageIndex field
    // delete product.currentImageIndex;
    // console.log('Applicant:', product)

    // Update the product on the server
    // this._applicantService.updateApplicant(this.data.id, product).subscribe(() => {
    //   // Show a success message
    //   this.showFlashMessage("success");
    //   this.matDialogRef.close();

    //   // Navigate to Vehivle Page
    //   this._router.navigate(["/apps/applicants"]);
    // });

    // submitting the form data

    console.warn('Your order has been submitted', this.firstFormGroup );
    console.warn('Your order has been submitted', this.secondFormGroup );
    console.warn('Your order has been submitted', this.thirdFormGroup );
    console.warn('Your order has been submitted', this.fourthFormGroup );
    console.warn('Your order has been submitted', this.fifthFormGroup );
    console.warn('Your order has been submitted', this.sixthFormGroup );


  }

  showFlashMessage(type: 'success' | 'error'): void {
    // Show the message
    this.flashMessage = type;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
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
  selectionChange(event) {
    if (event.selectedIndex == 0){
      this.isBack = false;
    }
    else {
      this.isBack = true;
    }
    event.selectedIndex == 6 ? this.isSubmit=true : this.isSubmit=false;
    }

    showPreview(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.fourthFormGroup.patchValue({
          avatar: file
        });
        this.fourthFormGroup.get('avatar').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(file);
      }





}
