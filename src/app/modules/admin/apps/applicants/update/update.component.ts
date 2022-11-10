/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
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
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment from 'moment';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
})
// @Inject(MAT_DIALOG_DATA)
export class UpdateComponent implements OnInit {
    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;

    // #region local variables
    form: FormGroup;
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    sixthFormGroup: FormGroup;
    seventhFormGroup: FormGroup;
    isSubmit = false;
    isBack = false;
    imageURL: string = '';
    //   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    routeID: string;
    avatar: string = '';
    isEdit: boolean;
     //#endregion

    constructor(
        public matDialogRef: MatDialogRef<UpdateComponent>,
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        breakpointObserver: BreakpointObserver
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        this.routeID = data ? data.id : '';
    }

    ngOnInit(): void {
        this.initfarmGroups();
        this.isEdit = this.data.isEdit;
    }
    initfarmGroups() {
        // #region initializing forms
        this.firstFormGroup = this._formBuilder.group({
            fname: ['', ''],
            lname: ['', ''],
            email: ['', ''],
            cellNumber: ['', ''],
            homeNumber: ['', ''],
            languages: [''],
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
            province: ['', ''],
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
        this.seventhFormGroup = this._formBuilder.group({
            degree: ['', ''],
            institution: ['', ''],
            education: ['', ''],
        });

        // #endregion
        // #region populating farms
        // Get the employee by id
        if (this.data !== null) {
            this._applicantService
                .getApplicantById(this.data?.id)
                .subscribe((employee) => {
                    // console.log('--',moment( employee.firstSentDate).subtract(1, 'week').hour(18).minute(56).toISOString());

                     this.firstFormGroup = this._formBuilder.group({
                       fname: employee.firstEmail,
                       lname: moment( employee.firstSentDate).subtract(1, 'week').hour(18).minute(56).toISOString(),
                       email: employee.secondEmail,
                       cellNumber: employee.cellPhone,
                       homeNumber:employee.cellPhone,
                       languages:employee.status,
                    //    secondSentDate: moment( employee.secondSentDate).subtract(1, 'week').hour(18).minute(56).toISOString(),
                    //    applicationDate: moment( employee.applicationDate).subtract(1, 'week').hour(18).minute(56).toISOString(),

                     });
                    this.secondFormGroup.patchValue({
                        fullName: employee.name,
                        lastNameFirstName: employee.name,
                        firstName: employee.fname,
                        lastName: employee.lname,
                        cellPhone: employee.cellPhone,
                        homePhone: employee.homePhone,
                        email: employee.email,
                    });
                    this.fourthFormGroup.patchValue({
                        dob: moment(employee.dob)
                            .subtract(1, 'week')
                            .hour(18)
                            .minute(56)
                            .toISOString(),
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
                        //   imageURL: employee.imageURL,
                        avatar: employee.avatar,
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
                    this.seventhFormGroup.patchValue({
                        degree: employee.name,
                        institution: employee.name,
                        education: employee.name,
                    });
                    this._changeDetectorRef.markForCheck();
                });
        } else {
        }
        // #endregion
    }

    submit(): void {

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

    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {}

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {}

    /**
     * Send the message
     */
    send(): void {}
    selectionChange(event) {
        if (event.selectedIndex == 0) {
            this.isBack = false;
        } else {
            this.isBack = true;
        }
        event.selectedIndex == 5
            ? (this.isSubmit = true)
            : (this.isSubmit = false);
    }

    showPreview(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.fourthFormGroup.patchValue({
            avatar: file,
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
