import { ChangeDetectorRef, Directive, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { Applicant, Country } from '../../../employee.types';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { states } from 'JSON/state';
import { countryList } from 'JSON/country';

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

    //#region Observables
    applicant$: Observable<Applicant>;
    isLoadingApplicant$: Observable<boolean>;
    applicants$: Observable<Applicant[]>;
    isLoadingApplicants$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;

    //#endregion

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
    routeID: string;
    avatar: string = '';
    isEdit: boolean;
    states: string[] = [];
    stateOptions: Observable<string[]>;
    countryList: string[] = [];
    countryOptions: Observable<string[]>;
    imagePreview: string;
    isImage: boolean = true;
    formValid: boolean;
    isState: boolean = false;
    graduation_year: any;
    resumePreview: string = '';
    countryCode: Country[];
    countries: Country[];
    cellPhoneCountryCodeLength: any = 1;
    homePhoneCountryCodeLength: any = 1;
    currentSupervisorCountryCodeLength: any = 1;
    previousSupervisorCountryCodeLength: any = 1;
    validCountry: boolean = true;
    validState: boolean = false;
    step: number = 0;
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
        this.initObservables();
        this.initApplicantForm();
        this.patchCountryCode();
        this.initCalendar();
        this.formUpdates();
        this.states = states;
        this.countryList = countryList;
        
        //Auto Complete functions for State and Country
        this.stateOptions = this.secondFormGroup.valueChanges.pipe(
            startWith(''),
            map(value => this._filterStates(value.state || '')),
        );

        this.countryOptions = this.secondFormGroup.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCountries(value.country || '')),
        );


        this.isEdit = this.data.isEdit;
        //To close dialog
        this._applicantService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._applicantService.closeDialog.next(false);
                }
            });

    }

    //Auto Complete functions for State and Country

    private _filterStates(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.states.filter(state => state.toLowerCase().includes(filterValue));
    }

    private _filterCountries(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.countryList.filter(country => country.toLowerCase().includes(filterValue));
    }
    // #region initializing forms
    initApplicantForm() {
        this.firstFormGroup = this._formBuilder.group({
            id: [''],
            first_name: ['' || this.data.employeeData?.employee_info?.first_name , [Validators.required]],
            last_name: [''  || this.data.employeeData?.employee_info?.last_name , [Validators.required]],
            email: ['' || this.data.employeeData?.employee_info?.email , [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            date_of_birth: [''  || this.data.employeeData?.employee_info?.date_of_birth , [Validators.required]],
            age: ['' || this.data.employeeData?.employee_info?.age , [Validators.required]],
            marital_status: [''  || this.data.employeeData?.employee_info?.marital_status , [Validators.required]],
            languages: [''  || this.data.employeeData?.employee_info?.languages.replace(/\s/g, '').split(',') , [Validators.required]],
            rank_speaking_english: [''  || this.data.employeeData?.employee_info?.rank_speaking_english , [Validators.required]],
            passport: [''  || this.data.employeeData?.employee_info?.passport.toString() , [Validators.required]],
            us_citizen: [''  || this.data.employeeData?.employee_info?.us_citizen.toString() , [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            address_1: ['' || this.data.employeeData?.employee_info?.address_1, [Validators.required]],
            address_2: ['' || this.data.employeeData?.employee_info?.address_2],
            town_city: ['' || this.data.employeeData?.employee_info?.town_city, [Validators.required]],
            county_providence: ['' || this.data.employeeData?.employee_info?.county_providence, [Validators.required]],
            postal_code: ['' || this.data.employeeData?.employee_info?.postal_code, [Validators.required]],
            state: ['' || this.data.employeeData?.employee_info?.state],
            country: ['' || this.data.employeeData?.employee_info?.country, [Validators.required]],
            cell_phone_number: ['' || this.data.employeeData?.employee_info?.cell_phone_number, [Validators.required]],
            cell_phone_country_code: ['zz' , [Validators.required, Validators.pattern("^(?:(?!zz).)*$")]],
            home_phone_number: ['' || this.data.employeeData?.employee_info?.home_phone_number],
            home_phone_country_code: ['zz'],
            avatar: ['' || this.data.employeeData?.employee_info?.avatar, [Validators.required]],
        });
        
        this.thirdFormGroup = this._formBuilder.group({
            current_employer: ['' || this.data.employeeData?.employee_info?.current_employer],
            current_position_title: ['' || this.data.employeeData?.employee_info?.current_position_title ],
            current_description_of_role: ['' || this.data.employeeData?.employee_info?.current_description_of_role],
            current_employment_period_start: ['' || this.data.employeeData?.employee_info?.current_employment_period_start],
            current_employment_period_end: ['' || this.data.employeeData?.employee_info?.current_employment_period_end],
            current_supervisor_reference: ['' || this.data.employeeData?.employee_info?.current_supervisor_reference],
            current_supervisor_phone_number: ['' || this.data.employeeData?.employee_info?.current_supervisor_phone_number],
            current_supervisor_country_code: ['zz'],
            current_contact_supervisor: [false || this.data.employeeData?.employee_info?.current_contact_supervisor.toString()] ,

            previous_employer: [''|| this.data.employeeData?.employee_info?.previous_employer , [Validators.required]],
            previous_position_title: [''|| this.data.employeeData?.employee_info?.previous_position_title, [Validators.required]],
            previous_description_of_role: [''|| this.data.employeeData?.employee_info?.previous_description_of_role, [Validators.required]],
            previous_employment_period_start: [''|| this.data.employeeData?.employee_info?.previous_employment_period_start, [Validators.required]],
            previous_employment_period_end: [''|| this.data.employeeData?.employee_info?.previous_employment_period_end, [Validators.required]],
            previous_supervisor_reference: [''|| this.data.employeeData?.employee_info?.previous_supervisor_reference, [Validators.required]],
            previous_supervisor_phone_number: [''|| this.data.employeeData?.employee_info?.previous_supervisor_phone_number],
            previous_supervisor_country_code: ['zz'],
            previous_contact_supervisor: [''|| this.data.employeeData?.employee_info?.previous_contact_supervisor.toString(), [Validators.required]],
            resume: [''|| this.data.employeeData?.employee_info?.resume],

            authorized_to_work: [''|| this.data.employeeData?.employee_info?.authorized_to_work.toString(), [Validators.required]],
            cdl_license: [''|| this.data.employeeData?.employee_info?.cdl_license.toString(), [Validators.required]],
            lorry_license: [''|| this.data.employeeData?.employee_info?.lorry_license.toString(), [Validators.required]],
            tractor_license: [''|| this.data.employeeData?.employee_info?.tractor_license.toString(), [Validators.required]],
            work_experience_description: [''|| this.data.employeeData?.employee_info?.work_experience_description.toString(), [Validators.required]],

            question_1: [''|| this.data.employeeData?.employee_info?.question_1, [Validators.required]],
            question_2: [''|| this.data.employeeData?.employee_info?.question_2, [Validators.required]],
            question_3: [''|| this.data.employeeData?.employee_info?.question_3, [Validators.required]],
            question_4: [''|| this.data.employeeData?.employee_info?.question_4, [Validators.required]],
            question_5: [''|| this.data.employeeData?.employee_info?.question_5, [Validators.required]],
        });

        this.fourthFormGroup = this._formBuilder.group({
            school_college: [''|| this.data.employeeData?.employee_info?.school_college],
            degree_name: [''|| this.data.employeeData?.employee_info?.degree_name],
            graduation_year: ['' || this.data.employeeData?.employee_info?.graduation_year, [Validators.required]],
            reason_for_applying: [''|| this.data.employeeData?.employee_info?.reason_for_applying.replace(/\s/g, '').split(','), [Validators.required]],
            hear_about_dht: [''|| this.data.employeeData?.employee_info?.hear_about_dht, [Validators.required]],
            unique_fact: [''|| this.data.employeeData?.employee_info?.unique_fact],


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
            this.sixthFormGroup,
        ];

        if (this.data?.applicantData) {
            this._changeDetectorRef.markForCheck();
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
        this._applicantService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

    }
    //#endregion

    //#region Init Calendar
    initCalendar() {
        //Calender Year Initilize
        if (this.data) {
            this.graduation_year = new FormControl(this.data.graduation_year);
            console.log("im in calendar", this.data);

        } else {
            this.graduation_year = new FormControl(moment());
        }
    }
    //#endregion

    submit(): void {
        this._applicantService.isLoadingApplicant.next(true);

        //Merge all stepper forms in one form
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach((element) => {
                const control = this._formBuilder.control(element[1]);
                this.form.addControl(element[0], control);
            });
        });
        //Filtered and replace country iso with country code in form
        this.getCountryByCode('cell_phone_country_code');
        this.getCountryByCode('home_phone_country_code');
        this.getCountryByCode('current_supervisor_country_code');
        this.getCountryByCode('previous_supervisor_country_code');

        // checks for updated applicant
        if (this.data && this.data.isEdit) {
            // this.form.value['customer_type'] = this.form.value['customer_type'].join(', ');
            this.updateApplicant(this.form.value);
        } else {
            var formData: FormData = new FormData();
            formData.append('image', this.secondFormGroup.get('avatar').value);
            if (this.thirdFormGroup.get('resume').value) {
                formData.append('resume', this.thirdFormGroup.get('resume').value);
            }
            formData.append('form', JSON.stringify(this.form.value));
            this._applicantService.createApplicant(formData, false);
        }
    }
    updateApplicant(applicantData: any): void {
        this._applicantService.updateApplicant(applicantData);
    }



    //#region Calendar Year Function
    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.graduation_year.value);
        ctrlValue.year(normalizedYear.year());
        this.graduation_year.setValue(ctrlValue);
        this.fourthFormGroup.value.graduation_year = ctrlValue;
        datepicker.close();
    }
    //#endregion

    discard(): void {
        // Close the dialog
        this._applicantService.isLoadingApplicant.next(false);
        this.matDialogRef.close();
    }

    selectionChange(event) {
        this.step = event.selectedIndex;
        if (event.selectedIndex == 0) {
            this.isBack = false;
        } else {
            this.isBack = true;
        }
        event.selectedIndex == 4
            ? (this.isSubmit = true)
            : (this.isSubmit = false);

    }

    //#region Upload Image
    uploadImage(event: any) {
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.includes('image/')
        ) {
            this.isImage = true;
            const reader = new FileReader();
            reader.onload = (_event: any) => {
                this.imageURL = _event.target.result;
                this.secondFormGroup.controls['avatar']?.setValue(event.target.files[0]);
                //this.imageURL.markAsDirty();
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {
            this.isImage = false;
        }
    }
    //#endregion

    //#region Upload Resume
    uploadResume(event: any) {
        if (
            event.target.files &&
            event.target.files[0]
        ) {
            const reader = new FileReader();
            reader.onload = (_event: any) => {
                this.resumePreview = event.target.files[0].name
                this.thirdFormGroup.controls['resume']?.setValue(event.target.files[0]);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else {

        }
    }
    //#endregion

    //#region Form Value Updates
    formUpdates() {
        this.secondFormGroup?.get('country').valueChanges.subscribe((_formValue => {
            if (_formValue === "United States of America") {
                this.isState = true;
                this.secondFormGroup.controls['state'].setValue('');
            }
            else {
                this.isState = false;
            }
        }));
    }
    //#endregion

    //#region Country Form Validation
    formValidation(e, type) {
        debugger
        if (type === "country") {
            if (this.countryList.includes(e)) {
                this.validCountry = true;
                this.secondFormGroup.controls['country'].setErrors(null);
            }
            else {
                this.validCountry = false;
                this.secondFormGroup.controls['country'].setErrors({ 'incorrect': true });
            }
        }
        else if (type === "state") {
            if (this.states.includes(e)) {
                this.validState = true;
                this.secondFormGroup.controls['state'].setErrors(null);
            }
            else {
                this.validState = false;
                this.secondFormGroup.controls['state'].setErrors({ 'incorrect': true });
            }
        }
    }
    //#endregion



    //#region Country code
    getCountryByIso(iso: string, index): Country {
        const country = this.countries.find(country => country.iso === iso);
        if (index == 1 && country.code.length > 0) this.cellPhoneCountryCodeLength = country.code.length
        else if (index == 2 && country.code.length > 0) this.homePhoneCountryCodeLength = country.code.length
        else if (index == 3 && country.code.length > 0) this.currentSupervisorCountryCodeLength = country.code.length
        else if (index == 4 && country.code.length > 0) this.previousSupervisorCountryCodeLength = country.code.length

        return country;
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    //#endregion

    //#region Patch Country Code
    patchCountryCode(){       
        // const cell_phone_country_code = ;
        // const home_phone_country_code = ;
        // const current_supervisor_country_code = ;
        // const previous_supervisor_country_code = this.countries.find(country => country.code === this.data.employeeData?.employee_info?.previous_supervisor_country_code);
        this.secondFormGroup.patchValue({
            cell_phone_country_code: this.countries.find(country => country.code === this.data.employeeData?.employee_info?.cell_phone_country_code).iso,
            home_phone_country_code:    this.countries.find(country => country.code === this.data.employeeData?.employee_info?.home_phone_country_code).iso
        })
        this.thirdFormGroup.patchValue({
            current_supervisor_country_code: this.countries.find(country => country.code === this.data.employeeData?.employee_info?.current_supervisor_country_code).iso,
            previous_supervisor_country_code: this.countries.find(country => country.code === this.data.employeeData?.employee_info?.previous_supervisor_country_code).iso
        })
    }

    //#region Filter country iso and replace with code
    getCountryByCode(formValue: string) {
        let country_code;
        country_code = this.countries.find(country => country.iso === this.form.get(formValue).value)
        this.form.get(formValue).setValue(country_code.code);
    }
    //#endregion

    //#region Email Exists 
    asyncValidator = (control: FormControl) => {
        return this._applicantService.checkIfEmailExists(control.value);
    }
    //#endregion
}
