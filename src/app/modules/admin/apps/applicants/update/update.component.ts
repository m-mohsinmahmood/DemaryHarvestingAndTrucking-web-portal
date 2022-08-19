// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-update',
//   templateUrl: './update.component.html',
//   styleUrls: ['./update.component.scss']
// })
// export class UpdateComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateComponent implements OnInit {

  roles: string[] = ['single', 'Married', 'Divorced']
  stepperOrientation: Observable<StepperOrientation>;

  form: FormGroup;
  employees:any;
  flashMessage: "success" | "error" | null = null;
  firstFormGroup : FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup : FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup : FormGroup;
  sixthFormGroup : FormGroup;
  isSubmit = false;
  isBack = false;

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
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
    }

  ngOnInit(): void {

//   this.form = this._formBuilder.group({
//     fname     : ['', [Validators.required]],
//     lname     : ['', [Validators.required]],
//     role    : ['', [Validators.required]],
//     position: ['', [Validators.required]],
//     email   : ['', [Validators.email]],
//     salary  : ['',[]],
//     currentEmployee : ['',[]],
// });
this.firstFormGroup = this._formBuilder.group({
  firstEmail: ["", ""],
  firstSentDate: ["", ""],
  secondEmail: ["", ""],
  secondSentDate: ["", ""],
  applicationDate: ["", ""],
  // fullName: ["", ""],

});

this.secondFormGroup = this._formBuilder.group({
  fullName: ["", ""],
  lastNameFirstName: ["", ""], 
  firstName: ["", ""],
  lastName: ["", ""],
  cellPhone: ["", ""],
  homePhone: ["", ""],
  email: ["", ""],
});

this.thirdFormGroup = this._formBuilder.group({
  firstPhoneCall: ["", ""],
  firstInterviewResult: ["", ""],
  firstRanking: ["", ""],
  refreePhoneCall: ["", ""],
  refreeInterviewResult: ["", ""],
  refreeRanking: ["", ""],
  secondPhoneCall: ["", ""],
  secondInterviewResult: ["", ""],
  secondRanking: ["", ""],
  thirdPhoneCall: ["", ""],
  thirdInterviewResult: ["", ""],
  thirdRanking: ["", ""],
});

this.fourthFormGroup = this._formBuilder.group({
  dob: ["", ""],
  maritalStatus: ["", ""],
  address1: ["", ""],
  address2: ["", ""],
  city: ["", ""],
  province:["",""],
  county: ["", ""],
  postalCode: ["", ""],
  country: ["", ""],
  usCitizen: ["", ""],
  license: ["", ""],
  passport: ["", ""],
});

this.fifthFormGroup = this._formBuilder.group({
  firstQuestion: ["", ""],
  secondQuestion: ["", ""],
  thirdQuestion: ["", ""],
  fourthQuestion: ["", ""],
  fifthQuestion: ["", ""],
  workExperience: ["", ""],
  job: ["", ""],
  supervisor: ["", ""],
  supervisorContact: ["", ""],
});

this.sixthFormGroup = this._formBuilder.group({
  e_firstQuestion: ["", ""],
  e_secondQuestion: ["", ""],
  e_thirdQuestion: ["", ""],
});

   // Get the employee by id
   this._applicantService.getApplicantById(this.data.id).subscribe((employee) => {
    console.log('Applicant:',employee);
    // this.employees = employee;
    // this.secondFormGroup.patchValue(employee);
    this.firstFormGroup = this._formBuilder.group({
      firstEmail: employee.firstEmail,
      firstSentDate: employee.firstSentDate,
      secondEmail: employee.secondEmail,
      secondSentDate: employee.secondSentDate,
      applicationDate: employee.applicationDate,
    
    });
    this.secondFormGroup.patchValue({
      fullName: employee.name,
      lastNameFirstName: employee.name, 
      firstName: employee.fname,
      lastName: employee.lname,
      cellPhone: employee.cellPhone,
      homePhone: employee.homePhone,
      email: employee.email,
    })
    this.thirdFormGroup.patchValue({
      firstPhoneCall: employee.firstPhoneCall,
      firstInterviewResult: employee.firstInterviewResult,
      firstRanking: employee.firstRanking,
      refreePhoneCall: employee.refreePhoneCall,
      refreeInterviewResult: employee.refreeInterviewResult,
      refreeRanking: employee.refreeRanking,
      secondPhoneCall: employee.secondPhoneCall,
      secondInterviewResult: employee.secondInterviewResult,
      secondRanking: employee.secondRanking,
      thirdPhoneCall: employee.thirdPhoneCall,
      thirdInterviewResult: employee.thirdInterviewResult,
      thirdRanking: employee.thirdRanking,
    });
    this.fourthFormGroup.patchValue({
      dob: employee.dob,
      maritalStatus: employee.martialStatus,
      address1: employee.address1,
      address2: employee.address2,
      city: employee.town,
      province: employee.state,
      postalCode: employee.postalCode,
      country: employee.country,
      usCitizen: employee.citizenStatus,
      license: employee.tractorStatus,
      passport: employee.passport,
    });
    this.fifthFormGroup.patchValue({
      firstQuestion: employee.fifthQuestion,
      secondQuestion: employee.secondQuestion,
      thirdQuestion: employee.thirdQuestion,
      fourthQuestion: employee.fourthQuestion,
      fifthQuestion: employee.fifthQuestion,
      workExperience: employee.workExperience,
      job: employee.job,
      supervisor: employee.supervisor,
      supervisorContact: employee.supervisorContact,
    });
    this.sixthFormGroup.patchValue({
      e_firstQuestion: employee.e_firstQuestion,
      e_secondQuestion: employee.e_secondQuestion,
      e_thirdQuestion: employee.e_thirdQuestion,
    });

  
    this._changeDetectorRef.markForCheck();

});



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

  showFlashMessage(type: "success" | "error"): void {
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
  selectionChange (event) {
    if (event.selectedIndex == 0){
      this.isBack = false
    }
    else {
      this.isBack = true;
    }
    event.selectedIndex == 6 ? this.isSubmit=true : this.isSubmit=false;
    }
  
 

}
