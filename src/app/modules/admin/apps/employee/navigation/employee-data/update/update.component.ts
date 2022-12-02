import { ChangeDetectorRef, Component, Directive, Inject, OnInit, ViewChild } from '@angular/core';
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
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
export const MY_FORMATS_2 = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@Directive({
    selector: '[birthdayFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_2 },
    ],
})
export class BirthDateFormat {
}

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

    ],

})


// @Inject(MAT_DIALOG_DATA)
export class UpdateEmployeeComponent implements OnInit {
    // applicant$: Observable<Applicant>;
    // isLoadingApplicant$: Observable<boolean>;
    // applicants$: Observable<Applicant[]>;
    // isLoadingApplicants$: Observable<boolean>;
    // closeDialog$: Observable<boolean>;
    // private _unsubscribeAll: Subject<any> = new Subject<any>();

    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;

    // #region local variables
    form: FormGroup;
    formArr = [];
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
    calendar_year;
    applicantObjDataCal: any;
    date = new FormControl(moment());
    //   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    routeID: string;
    avatar: string = '';
    isEdit: boolean;
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<UpdateEmployeeComponent>,
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        breakpointObserver: BreakpointObserver
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        this.routeID = data.applicant_info ? data.applicant_info.id : '';
    }

    ngOnInit(): void {
        this.initApplicantForm();
        this.initObservables();
        this.initCalendar();

        console.log("abcd", this.data.applicantData);
        this.isEdit = this.data.isEdit;
        // this._applicantService.closeDialog$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((res) => {
        //         if (res) {
        //             this.matDialogRef.close();
        //             this._applicantService.closeDialog.next(false);
        //         }
        //     });
    }
    // #region initializing forms
    initApplicantForm() {
        console.log("this.data", this.data);
        this.firstFormGroup = this._formBuilder.group({
            id: [''],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cell_phone_number: ['', [Validators.required]],
            home_phone_number: [''],
            date_of_birth: ['', [Validators.required]],
            age: ['', [Validators.required]],
            marital_status: ['', [Validators.required]],
            languages: ['', [Validators.required]],
            rank_speaking_english: ['', [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            address_1: ['', [Validators.required]],
            address_2: [''],
            town_city: ['', [Validators.required]],
            county_providence: ['', [Validators.required]],
            state: ['', [Validators.required]],
            postal_code: ['', [Validators.required]],
            country: ['', [Validators.required]],
            avatar: [''],
        });

        this.thirdFormGroup = this._formBuilder.group({
            question_1: ['', [Validators.required]],
            question_2: ['', [Validators.required]],
            question_3: ['', [Validators.required]],
            question_4: ['', [Validators.required]],
            question_5: ['', [Validators.required]],
            authorized_to_work: ['', [Validators.required]],
            us_citizen: ['', [Validators.required]],
            cdl_license: ['', [Validators.required]],
            lorry_license: ['', [Validators.required]],
            tractor_license: ['', [Validators.required]],
            passport: ['', [Validators.required]],
            work_experience_description: ['', [Validators.required]],
            employment_period: ['', [Validators.required]],


        });

        this.fourthFormGroup = this._formBuilder.group({
            supervisor_name: ['', [Validators.required]],
            supervisor_contact: ['', [Validators.required]],
            degree_name: ['', [Validators.required]],
            reason_for_applying: ['', [Validators.required]],
            hear_about_dht: ['', [Validators.required]],

        });

        this.fifthFormGroup = this._formBuilder.group({
            us_phone_number: [''],
            blood_type: [''],
            emergency_contact_name: [''],
            emergency_contact_phone: [''],


        });
        this.sixthFormGroup = this._formBuilder.group({
            first_phone_call: [''],
            first_call_remarks: [''],
            first_call_ranking: [''],
            first_interviewer_id: [''],
            reference_phone_call: [''],
            reference_call_remarks: [''],
            reference_call_ranking: [''],
            reference_interviewer_id: [''],
            second_phone_call: [''],
            second_call_remarks: [''],
            second_call_ranking: [''],
            second_interviewer_id: [''],
            third_phone_call: [''],
            third_call_remarks: [''],
            third_call_ranking: [''],
            third_interviewer_id: [''],
        });

        this.formArr = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup,
            this.fifthFormGroup,
            this.sixthFormGroup,
        ];

        if (this.data.applicantData !== null) {
            const { applicantObjData } = this.data.applicantData;
            console.log("applicantObjData1", this.data.applicantData.first_name);

            console.log("applicantObjData1", this.data.applicantData);
            this.firstFormGroup.patchValue({
                id: this.data.applicantData?.id,
                first_name: this.data.applicantData?.first_name,
                last_name: this.data.applicantData.last_name,
                email: this.data.applicantData.email,
                cell_phone_number: this.data.applicantData.cell_phone_number,
                home_phone_number: this.data.applicantData.home_phone_number,
                date_of_birth: this.data.applicantData.date_of_birth,
                age: this.data.applicantData.age,
                marital_status: this.data.applicantData.marital_status,
                rank_speaking_english: this.data.applicantData.rank_speaking_english,
                languages: this.data.applicantData.languages.replace(/\s/g, '').split(','),
                // status: this.data.applicantData.status,
            });
            this.secondFormGroup.patchValue({
                address_1: this.data.applicantData.address_1,
                address_2: this.data.applicantData.address_2,
                town_city: this.data.applicantData.town_city,
                county_providence: this.data.applicantData.county_providence,
                state: this.data.applicantData.state,
                postal_code: this.data.applicantData.postal_code,
                country: this.data.applicantData.country,
                avatar: this.data.applicantData.avatar,
            });
            this.thirdFormGroup.patchValue({
                question_1: this.data.applicantData.question_1,
                question_2: this.data.applicantData.question_2,
                question_3: this.data.applicantData.question_3,
                question_4: this.data.applicantData.question_4,
                question_5: this.data.applicantData.question_5,
                authorized_to_work: this.data.applicantData.authorized_to_work.toString(),
                us_citizen: this.data.applicantData.us_citizen.toString(),
                cdl_license: this.data.applicantData.cdl_license.toString(),
                lorry_license: this.data.applicantData.lorry_license.toString(),
                tractor_license: this.data.applicantData.tractor_license.toString(),
                passport: this.data.applicantData.passport.toString(),
                work_experience_description: this.data.applicantData.work_experience_description,
                employment_period: this.data.applicantData.employment_period,



            });
            this.fourthFormGroup.patchValue({
                supervisor_name: this.data.applicantData.supervisor_name,
                supervisor_contact: this.data.applicantData.supervisor_contact,
                degree_name: this.data.applicantData.degree_name,
                reason_for_applying: this.data.applicantData.reason_for_applying,
                hear_about_dht: this.data.applicantData.hear_about_dht,
            });
            this.fifthFormGroup.patchValue({
                us_phone_number: this.data.applicantData.us_phone_number,
                blood_type: this.data.applicantData.blood_type,
                emergency_contact_name: this.data.applicantData.emergency_contact_name,
                emergency_contact_phone: this.data.applicantData.emergency_contact_phone,

            });
            this.sixthFormGroup.patchValue({
                first_call_remarks: this.data.applicantData.first_call_remarks,
                first_call_ranking: this.data.applicantData.first_call_ranking,
                first_interviewer_id: this.data.applicantData.first_interviewer_id,

                reference_call_remarks: this.data.applicantData.reference_call_remarks,
                reference_call_ranking: this.data.applicantData.reference_call_ranking,
                reference_interviewer_id: this.data.applicantData.reference_interviewer_id,

                second_call_remarks: this.data.applicantData.second_call_remarks,
                second_call_ranking: this.data.applicantData.second_call_ranking,
                second_interviewer_id: this.data.applicantData.second_interviewer_id,

                third_call_remarks: this.data.applicantData.third_call_remarks,
                third_call_ranking: this.data.applicantData.third_call_ranking,
                third_interviewer_id: this.data.applicantData.third_interviewer_id,
            });
            this._changeDetectorRef.markForCheck();
        }
    }
    // #endregion


    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next(null);
        // this._unsubscribeAll.complete();
    }

    //#region Init Observables
    initObservables() {
        // this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;
        // this.closeDialog$ = this._applicantService.closeDialog$;
    }
    //#endregion

    //#region Init Calendar
    initCalendar() {
        //Calender Year Initilize
        if (this.data) {
            this.calendar_year = new FormControl(this.data.calendar_year);
            console.log("im in calendar", this.data);

        } else {
            this.calendar_year = new FormControl(moment());
        }
    }
    //#endregion

    submit(): void {
        // this.form = this._formBuilder.group({});
        // this.formArr.forEach((f) => {
        //     Object.entries(f.value).forEach((element) => {
        //         const control = this._formBuilder.control(element[1]);
        //         this.form.addControl(element[0], control);
        //     });
        // });
        // this._applicantService.isLoadingApplicant.next(true);
        // if (this.data && this.data.isEdit) {
        //     // this.form.value['customer_type'] = this.form.value['customer_type'].join(', ');
        //     this.updateApplicant(this.form.value);
        // } else {
            // this._applicantService.createApplicant(this.form.value);
        // }
    }
    // updateApplicant(applicantData: any): void {
    //     this._applicantService.updateApplicant(applicantData);
    // }



    //#region Calendar Year Function
    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        console.log(this.calendar_year.value);
        console.log(ctrlValue);

        this.secondFormGroup.value.calendar_year = ctrlValue;
        datepicker.close();
    }

    //#endregion

    discard(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

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
