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
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

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
    formArr = [];

    data: 'routeIDa9beac0d-1ea0-42af-bc36-ca839f27271f';
    calendar_year: any;
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
        this.firstFormGroup = this._formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                    ),
                ],
            ],
            cell_phone_number: ['', [Validators.required]],
            home_phone_number: ['', ''],
            languages: ['', [Validators.required]],
            status: ['', [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            date_of_birth: ['', [Validators.required]],
            calendar_year: [moment()],
            marital_status: ['', [Validators.required]],
            address_1: ['', [Validators.required]],
            address_2: ['', ''],
            city: ['', [Validators.required]],
            county: ['', [Validators.required]],
            postal_code: ['', [Validators.required]],
            country: ['', [Validators.required]],
            us_citizen: ['', [Validators.required]],
            tractor_license: ['', [Validators.required]],
            passport: ['', [Validators.required]],
            //imageURL: ['', [Validators.required]],
            self_rating: [''],
            avatar: ['', ''],
        });
        this.thirdFormGroup = this._formBuilder.group({
            question_1: ['', [Validators.required]],
            question_2: ['', [Validators.required]],
            question_3: ['', [Validators.required]],
            question_4: ['', [Validators.required]],
            question_5: ['', [Validators.required]],
            work_experience_description: ['', [Validators.required]],
            recent_job: ['', [Validators.required]],
            supervisor: ['', [Validators.required]],
            supervisor_contact: ['', [Validators.required]],
        });

        this.fourthFormGroup = this._formBuilder.group({
            degree_name: ['', [Validators.required]],
            institute_name: ['', [Validators.required]],
            education: ['', [Validators.required]],
        });

        this.fifthFormGroup = this._formBuilder.group({
            blood_group: [''],
            reason_for_applying: ['', [Validators.required]],
            e_thirdQuestion: ['', ''],
        });
        this.sixthFormGroup = this._formBuilder.group({
            first_phone_call: [''],
            first_call_remarks: [''],
            firstRanking: [''],
            reference_phone_call: [''],
            reference_call_remarks: [''],
            refreeRanking: [''],
            second_phone_call: [''],
            second_call_remarks: [''],
            secondRanking: [''],
            third_phone_call: [''],
            third_call_remarks: [''],
            thirdRanking: [''],
        });

        this.formArr = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup,
            this.fifthFormGroup,
            this.sixthFormGroup,
        ];

    }
    
    submit(): void {
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach((element) => {
                const control = this._formBuilder.control(element[1]);
                this.form.addControl(element[0], control);
            });
        });
        this._applicantService.isLoadingApplicant.next(true);
        
            this._applicantService.createApplicant(this.form.value);
        
    }
    updateApplicant(applicantData: any): void {
        this._applicantService.updateApplicant(applicantData);
    }


    initCalendar() {
       
            this.calendar_year = new FormControl(moment());
        
    }

    //#region Calendar Year Function
    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
        datepicker.close();
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
