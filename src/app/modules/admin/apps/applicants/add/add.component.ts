import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatStepper } from '@angular/material/stepper';
import {StepperOrientation} from '@angular/material/stepper';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  stepperOrientation: Observable<StepperOrientation>;


  horizontalStepperForm: FormGroup;
  showMoreControls: any;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  stepperPage: any = 0;
  isLinear = true;

  firstFormGroup : FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup : FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup : FormGroup;
  sixthFormGroup : FormGroup;
 
  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddComponent>,
    breakpointObserver: BreakpointObserver,
    ) { this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {  
    this.firstFormGroup = this._formBuilder.group({
      firstEmail: ['', Validators.required],
      firstSentDate: ['', Validators.required],
      secondEmail: ['', Validators.required],
      secondSentDate: ['', Validators.required],
      applicationDate: ['', Validators.required]
    });
    
    this.secondFormGroup = this._formBuilder.group({
      fullName: ['', Validators.required],
      lastNameFirstName : ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cellPhone: ['', Validators.required],
      homePhone: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      firstPhoneCall: ['', Validators.required],
      firstInterviewResult : ['', Validators.required],
      firstRanking: ['', Validators.required],
      refreePhoneCall: ['', Validators.required],
      refreeInterviewResult: ['', Validators.required],
      refreeRanking: ['', Validators.required],
      secondPhoneCall: ['', Validators.required],
      secondInterviewResult : ['', Validators.required],
      secondRanking: ['', Validators.required],
      thirdPhoneCall: ['', Validators.required],
      thirdInterviewResult: ['', Validators.required],
      thirdRanking: ['', Validators.required],
    });
  
    this.fourthFormGroup = this._formBuilder.group({
      dob: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      county: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      usCitizen: ['', Validators.required],
      license: ['', Validators.required],
      passport: ['', Validators.required]
    });
    
    this.fifthFormGroup = this._formBuilder.group({
      firstQuestion: ['', Validators.required],
      secondQuestion: ['', Validators.required],
      thirdQuestion: ['', Validators.required],
      fourthQuestion: ['', Validators.required],
      fifthQuestion: ['', Validators.required],
      workExperience: ['', Validators.required],
      job: ['', Validators.required],
      supervisor: ['', Validators.required],
      supervisorContact: ['', Validators.required]
    });

    this.sixthFormGroup = this._formBuilder.group({
      firstQuestion: ['', Validators.required],
      secondQuestion: ['', Validators.required],
      thirdQuestion: ['', Validators.required],
    });
}
submit(): void {
  console.warn('Your order has been submitted', this.firstFormGroup );
  console.warn('Your order has been submitted', this.secondFormGroup );
  console.warn('Your order has been submitted', this.thirdFormGroup );
  console.warn('Your order has been submitted', this.fourthFormGroup );
  console.warn('Your order has been submitted', this.fifthFormGroup );
  console.warn('Your order has been submitted', this.sixthFormGroup );
  
  
}

onStepperNext(stepper: MatStepper) {
  this.stepperPage++ ;
  stepper.next();
}
onStepperBack(stepper: MatStepper) {
  this.stepperPage-- ;
  stepper.previous();
}
selectionChange (event) {
event.selectedIndex > 0  ? this.stepperPage++ : event.selectedIndex == 0 ? this.stepperPage = 0 : '';
}
 
  saveAndClose(): void
  {
     
      // Close the dialog
      this.matDialogRef.close();
  }

 
}
