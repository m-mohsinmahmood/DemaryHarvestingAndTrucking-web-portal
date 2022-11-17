// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-applicantpage',
//   templateUrl: './applicantpage.component.html',
//   styleUrls: ['./applicantpage.component.scss']
// })
// export class ApplicantpageComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment from 'moment';

@Component({
    selector: 'app-applicantpage',
      templateUrl: './applicantpage.component.html',
      styleUrls: ['./applicantpage.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ApplicantpageComponent implements OnInit
{
    panelOpenState = false;
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
    isEdit: boolean = true;
    data: 'routeIDa9beac0d-1ea0-42af-bc36-ca839f27271f';
     //#endregion

    // @ViewChild('comingSoonNgForm') comingSoonNgForm: NgForm;

    // alert: { type: FuseAlertType; message: string } = {
    //     type   : 'success',
    //     message: ''
    // };
    // comingSoonForm: FormGroup;
    // showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        // public matDialogRef: MatDialogRef<UpdateComponent>,
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        // @Inject(MAT_DIALOG_DATA) public data: any,

        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        breakpointObserver: BreakpointObserver
    )
    {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        // this.routeID = data ? data.id : '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.initfarmGroups();
        // this.isEdit = this.data.isEdit;
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
        // if (this.data !== null) {
        //     this._applicantService
        //         .getApplicantById('a9beac0d-1ea0-42af-bc36-ca839f27271f')
        //         .subscribe((employee) => {
        //             // console.log('--',moment( employee.firstSentDate).subtract(1, 'week').hour(18).minute(56).toISOString());

        //              this.firstFormGroup = this._formBuilder.group({
        //                 first_name: employee.first_name,
        //                 last_name: employee.last_name,
        //                email: employee.secondEmail,
        //                cell_phone_number: employee.cell_phone_number,
        //                home_phone_number:employee.home_phone_number,
        //                languages:employee.languages,
        //             //    secondSentDate: moment( employee.secondSentDate).subtract(1, 'week').hour(18).minute(56).toISOString(),
        //             //    applicationDate: moment( employee.applicationDate).subtract(1, 'week').hour(18).minute(56).toISOString(),

        //              });
        //             this.secondFormGroup.patchValue({
        //                 fullName: employee.name,
        //                 lastNameFirstName: employee.name,
        //                 first_name: employee.first_name,
        //                 last_name: employee.last_name,
        //                 cell_phone_number: employee.cell_phone_number,
        //                 home_phone_number: employee.home_phone_number,
        //                 email: employee.email,
        //             });
        //             this.fourthFormGroup.patchValue({
        //                 date_of_birth: moment(employee.date_of_birth)
        //                     .subtract(1, 'week')
        //                     .hour(18)
        //                     .minute(56)
        //                     .toISOString(),
        //                 marital_status: employee.marital_status,
        //                 address_1: employee.address_1,
        //                 address_2: employee.address_2,
        //                 city: employee.town,
        //                 province: employee.state,
        //                 postal_code: employee.postal_code,
        //                 country: employee.country,
        //                 us_citizen: employee.us_citizen,
        //                 tractor_license: employee.tractor_license,
        //                 passport: employee.passport,
        //                 //   imageURL: employee.imageURL,
        //                 avatar: employee.avatar,
        //             });
        //             this.fifthFormGroup.patchValue({
        //                 question_1: employee.question_1,
        //                 question_2: employee.question_2,
        //                 question_3: employee.question_3,
        //                 question_4: employee.question_4,
        //                 question_5: employee.question_5,
        //                 work_experience_description: employee.work_experience_description,
        //                 recent_job: employee.recent_job,
        //                 supervisor: employee.supervisor,
        //                 supervisor_contact: employee.supervisor_contact,
        //             });
        //             this.sixthFormGroup.patchValue({
        //                 degree_name: employee.degree_name,
        //                 institute_name: employee.institute_name,
        //                 education: employee.education,
        //             });
        //             this.seventhFormGroup.patchValue({
        //                 degree: employee.name,
        //                 institution: employee.name,
        //                 education: employee.name,
        //             });
        //             this._changeDetectorRef.markForCheck();
        //         });
        // } else {
        // }
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
        // this.matDialogRef.close();
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
