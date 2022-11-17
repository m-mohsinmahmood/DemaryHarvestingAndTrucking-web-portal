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
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { Applicant } from '../applicants.types';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
})
// @Inject(MAT_DIALOG_DATA)
export class UpdateComponent implements OnInit {
    applicant$: Observable<Applicant>;
    isLoadingApplicant$: Observable<boolean>;
    applicants$: Observable<Applicant[]>;
    isLoadingApplicants$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    applicantObjData: any;
    date = new FormControl(moment());
    //   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    routeID: string;
    avatar: string = '';
    isEdit: boolean;
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<UpdateComponent>,
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
        this.routeID = data ? data.id : '';
    }

    ngOnInit(): void {
        this.initApplicantForm();
        this.initObservables();
        this.initCalendar();

        this.isEdit = this.data.isEdit;
        this._applicantService.closeDialog$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._applicantService.closeDialog.next(false);
            }
        });
    }
    // #region initializing forms
    initApplicantForm() {
        this.firstFormGroup = this._formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
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

        this.formArr = [this.firstFormGroup, this.secondFormGroup, this.thirdFormGroup, this.fourthFormGroup, this.fifthFormGroup, this.sixthFormGroup]

        if (this.data !== null) {

            this._applicantService
                .getApplicantById(this.data?.id)
                .subscribe((applicantObjData) => {

                    this.firstFormGroup.patchValue({
                        first_name: applicantObjData.first_name,
                        last_name: applicantObjData.last_name,
                        email: applicantObjData.email,
                        cell_phone_number: applicantObjData.cell_phone_number,
                        home_phone_number: applicantObjData.home_phone_number,
                        languages: applicantObjData.languages,
                        status: applicantObjData.status,


                    });
                    this.secondFormGroup.patchValue({
                        date_of_birth: moment(applicantObjData.date_of_birth)
                            .subtract(1, 'week')
                            .hour(18)
                            .minute(56)
                            .toISOString(),
                        calendar_year: applicantObjData.calendar_year,
                        marital_status: applicantObjData.marital_status,
                        address_1: applicantObjData.address_1,
                        address_2: applicantObjData.address_2,
                        city: applicantObjData.town,
                        province: applicantObjData.state,
                        postal_code: applicantObjData.postal_code,
                        country: applicantObjData.country,
                        usCitizen: applicantObjData.citizenStatus,
                        license: applicantObjData.tractorStatus,
                        passport: applicantObjData.passport,
                        county: applicantObjData.county,
                        //   imageURL: applicantObjData.imageURL,
                        avatar: applicantObjData.avatar,
                    });
                    this.thirdFormGroup.patchValue({
                        question_1: applicantObjData.question_1,
                        question_2: applicantObjData.question_2,
                        question_3: applicantObjData.question_3,
                        question_4: applicantObjData.question_4,
                        question_5: applicantObjData.question_5,
                        work_experience_description: applicantObjData.work_experience_description,
                        recent_job: applicantObjData.recent_job,
                        supervisor: applicantObjData.supervisor,
                        supervisor_contact: applicantObjData.supervisor_contact,
                    });
                    this.fourthFormGroup.patchValue({
                        degree_name: applicantObjData.degree_name,
                        institute_name: applicantObjData.institute_name,
                        education: applicantObjData.education,
                    });
                    this.fifthFormGroup.patchValue({
                        blood_group: applicantObjData.blood_group,
                        reason_for_applying: applicantObjData.reason_for_applying,
                    });
                    this.sixthFormGroup.patchValue({
                        first_phone_call: applicantObjData.first_phone_call,
                        first_call_remarks: applicantObjData.first_call_remarks,
                        firstRanking: applicantObjData.firstRanking,
                        reference_phone_call: applicantObjData.reference_phone_call,
                        reference_call_remarks: applicantObjData.reference_call_remarks,
                        refreeRanking: applicantObjData.refreeRanking,
                        second_phone_call: applicantObjData.second_phone_call,
                        second_call_remarks: applicantObjData.second_call_remarks,
                        secondRanking: applicantObjData.secondRanking,
                        third_phone_call: applicantObjData.third_phone_call,
                        third_call_remarks: applicantObjData.third_call_remarks,
                        thirdRanking: applicantObjData.thirdRanking,
                    });

                    this._changeDetectorRef.markForCheck();
                });
        }
    }
    // #endregion


    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //#region Init Observables
    initObservables() {
        this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;
        this.closeDialog$ = this._applicantService.closeDialog$;
    }
    //#endregion

    submit(): void {
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach(element => {
                const control = this._formBuilder.control(
                    element[1]
                )
                this.form.addControl(element[0], control)
            });
        });
        this._applicantService.isLoadingApplicant.next(true);
        if (this.data && this.data.isEdit) {
            // this.form.value['customer_type'] = this.form.value['customer_type'].join(', ');
            this.updateApplicant(this.form.value);
        } else {
            this._applicantService.createApplicant(this.form.value);
        }
    }
    updateApplicant(applicantData: any): void {
        this._applicantService.updateApplicant(
            applicantData);
    }
    initCalendar() {
        //Calender Year Initilize
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.data.applicantObjData.calendar_year);
        } else {
            this.calendar_year = new FormControl(moment());
        }
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
