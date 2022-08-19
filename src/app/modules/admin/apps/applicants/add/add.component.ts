
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatStepper } from '@angular/material/stepper';
import {StepperOrientation} from '@angular/material/stepper';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  stepperOrientation: Observable<StepperOrientation>;
  horizontalStepperForm: FormGroup;
  showMoreControls: any;
  floatLabelControl = new FormControl("auto" as FloatLabelType);
  stepperPage: any = 0;
  isSubmit = false;
  isBack = false;
  isLinear = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddComponent>,
    breakpointObserver: BreakpointObserver,
   private _applicantService: ApplicantService,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe("(min-width: 860px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
    // console.log("IDDDd", this.data.id);
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstEmail: ["", ""],
      firstSentDate: ["", ""],
      secondEmail: ["", ""],
      secondSentDate: ["", ""],
      applicationDate: ["", ""],
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
      firstQuestion: ["", ""],
      secondQuestion: ["", ""],
      thirdQuestion: ["", ""],
    });

    // Get the product by id
    // this._applicantService.getApplicantById(this.data.id).subscribe((applicant) => {
    //   // Set the selected product
    //   // this.selectedProduct = product;
    //   console.log("ID CALLED", applicant);
    //   // Fill the form
    //   // this.selectedProductForm.patchValue(product);
    //   // console.log("ID CALLED", this.selectedProductForm);
    //   // Mark for check
    //   // this._changeDetectorRef.markForCheck();
    //   //   console.log("ID CALLED")
    // });
  }
  submit() {
    const data = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      ...this.fourthFormGroup.value,
      ...this.fifthFormGroup.value,
      ...this.sixthFormGroup.value,
    };
    console.log("Combined-Data:", data);
  }

  selectionChange(event) {
    if (event.selectedIndex == 0) {
      this.isBack = false;
    } else {
      this.isBack = true;
    }
    event.selectedIndex == 6 ? (this.isSubmit = true) : (this.isSubmit = false);
  }

  saveAndClose(): void {
    // Close the dialog
    this.matDialogRef.close();
  }
}
