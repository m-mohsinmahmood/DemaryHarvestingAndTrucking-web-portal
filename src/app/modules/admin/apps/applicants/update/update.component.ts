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
import { Applicant, Country } from '../applicants.types';
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
export class UpdateComponent implements OnInit {

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
    }

    ngOnInit(): void {
        this.isEdit = this.data.isEdit;
        this.initApplicantForm();
        this.initObservables();
        this.isEdit ? this.patchCountryCode() : '';
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
            id: ['' || this.data?.applicantData?.id],
            first_name: ['' || this.data?.applicantData?.first_name, [Validators.required]],
            last_name: ['' || this.data?.applicantData?.last_name, [Validators.required]],
            email: ['' || this.data?.applicantData?.email, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")], !this.data?.isEdit? this.asyncValidator.bind(this) : ''],
            date_of_birth: ['' || this.data?.applicantData?.date_of_birth, [Validators.required]],
            age: ['' || this.data?.applicantData?.age, [Validators.required]],
            marital_status: ['' || this.data?.applicantData?.marital_status, [Validators.required]],
            languages: ['' || this.data?.applicantData?.languages.replace(/\s/g, '').split(','), [Validators.required]],
            rank_speaking_english: ['' || this.data?.applicantData?.rank_speaking_english, [Validators.required]],
            passport: ['' || this.data?.applicantData?.passport.toString(), [Validators.required]],
            us_citizen: ['' || this.data?.applicantData?.us_citizen.toString(), [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            address_1: ['' || this.data?.applicantData?.address_1, [Validators.required]],
            address_2: ['' || this.data?.applicantData?.address_2],
            town_city: ['' || this.data?.applicantData?.town_city, [Validators.required]],
            county_providence: ['' || this.data?.applicantData?.county_providence, [Validators.required]],
            postal_code: ['' || this.data?.applicantData?.postal_code, [Validators.required]],
            state: ['' || this.data?.applicantData?.state],
            country: ['' || this.data?.applicantData?.country, [Validators.required]],
            cell_phone_number: ['' || this.data?.applicantData?.cell_phone_number, [Validators.required]],
            cell_phone_country_code: ['zz', [Validators.required, Validators.pattern("^(?:(?!zz).)*$")]],
            home_phone_number: ['' || this.data?.applicantData?.home_phone_number],
            home_phone_country_code: ['zz'],
            avatar: ['' || this.data?.applicantData?.avatar, [Validators.required]],

        });

        this.thirdFormGroup = this._formBuilder.group({
            current_employer: ['' || this.data?.applicantData?.current_employer],
            current_position_title: ['' || this.data?.applicantData?.current_position_title],
            current_description_of_role: ['' || this.data?.applicantData?.current_description_of_role],
            current_employment_period_start: ['' || this.data?.applicantData?.current_employment_period_start],
            current_employment_period_end: ['' || this.data?.applicantData?.current_employment_period_end],
            current_supervisor_reference: ['' || this.data?.applicantData?.current_supervisor_reference],
            current_supervisor_phone_number: ['' || this.data?.applicantData?.current_supervisor_phone_number],
            current_supervisor_country_code: ['zz'],
            current_contact_supervisor: [false || this.data?.applicantData?.current_contact_supervisor.toString()],

            previous_employer: ['' || this.data?.applicantData?.previous_employer, [Validators.required]],
            previous_position_title: ['' || this.data?.applicantData?.previous_position_title, [Validators.required]],
            previous_description_of_role: ['' || this.data?.applicantData?.previous_description_of_role, [Validators.required]],
            previous_employment_period_start: ['' || this.data?.applicantData?.previous_employment_period_start, [Validators.required]],
            previous_employment_period_end: ['' || this.data?.applicantData?.previous_employment_period_end, [Validators.required]],
            previous_supervisor_reference: ['' || this.data?.applicantData?.previous_supervisor_reference, [Validators.required]],
            previous_supervisor_phone_number: ['' || this.data?.applicantData?.previous_supervisor_phone_number],
            previous_supervisor_country_code: ['zz'],
            previous_contact_supervisor: [false || this.data?.applicantData?.previous_contact_supervisor.toString(), [Validators.required]],
            resume: ['' || this.data?.applicantData?.resume],
            employment_period: ['' || this.data?.applicantData?.employment_period, [Validators.required]],

            authorized_to_work: ['' || this.data?.applicantData?.authorized_to_work.toString(), [Validators.required]],
            cdl_license: ['' || this.data?.applicantData?.cdl_license.toString(), [Validators.required]],
            lorry_license: ['' || this.data?.applicantData?.lorry_license.toString(), [Validators.required]],
            tractor_license: ['' || this.data?.applicantData?.tractor_license.toString(), [Validators.required]],
            work_experience_description: ['' || this.data?.applicantData?.work_experience_description.toString(), [Validators.required]],

            question_1: ['' || this.data?.applicantData?.question_1, [Validators.required]],
            question_2: ['' || this.data?.applicantData?.question_2, [Validators.required]],
            question_3: ['' || this.data?.applicantData?.question_3, [Validators.required]],
            question_4: ['' || this.data?.applicantData?.question_4, [Validators.required]],
            question_5: ['' || this.data?.applicantData?.question_5, [Validators.required]],
        });

        this.fourthFormGroup = this._formBuilder.group({
            school_college: ['' || this.data?.applicantData?.school_college],
            degree_name: ['' || this.data?.applicantData?.degree_name],
            graduation_year: [moment() || this.data?.applicantData?.graduation_year],
            reason_for_applying: ['' || this.data?.applicantData?.reason_for_applying.replace(/\s/g, ' ').split(','), [Validators.required]],
            hear_about_dht: ['' || this.data?.applicantData?.hear_about_dht, [Validators.required]],
            unique_fact: ['' || this.data?.applicantData?.unique_fact],
        });

        this.fifthFormGroup = this._formBuilder.group({
            us_phone_number: [''],
            blood_type: [''],
            unique_fact: [''],
            emergency_contact_name: [''],
            emergency_contact_phone: [''],


        });
        this.sixthFormGroup = this._formBuilder.group({
            status_step: ['' || this.data?.applicantData?.status_step],
            status_message: ['' || this.data?.applicantData?.status_message],
        });

        this.formArr = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup,
            this.isEdit ? this.sixthFormGroup : this.fifthFormGroup
        ];

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

        } else {
            this.graduation_year = new FormControl(moment());
        }
    }
    //#endregion

    submit(): void {
        this._applicantService.isLoadingApplicant.next(true);

        //Merge all stepper forms in one form
        debugger;
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

        //Replace null entries
        const form = Object.fromEntries(
            Object.entries(this.form.value).map(([key, value]) => [key, value === null ? "" : value])
        );

        if (form.current_contact_supervisor == '') {
            form.current_contact_supervisor = false;
        }

        // Form Data
        var formData: FormData = new FormData();
        formData.append('form', JSON.stringify(form));
        formData.append('image', this.secondFormGroup.get('avatar').value);
        formData.append('resume', this.thirdFormGroup.get('resume').value);
        if (this.data && this.data.isEdit) {
            this._applicantService.updateApplicant(formData,this.data?.applicantData?.id);
        }
        else {
            this._applicantService.createApplicant(formData, false);
        }
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
        debugger;
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

    //#region Filter country iso and replace with code
    getCountryByCode(formValue: string) {
        let country_code;
        country_code = this.countries.find(country => country.iso === this.form.get(formValue).value);
        this.form.get(formValue).setValue(country_code.iso + country_code.code);
    }
    //#endregion

    //#region Email Exists 
    asyncValidator = (control: FormControl) => {
        return this._applicantService.checkIfEmailExists(control.value);
    }
    //#endregion

    //#region Patch Country Code
    patchCountryCode() {
        this.secondFormGroup.patchValue({
            cell_phone_country_code: this.data.applicantData?.cell_phone_country_code?.split("+")[0],
            home_phone_country_code: this.data.applicantData?.home_phone_country_code?.split("+")[0]
        })
        this.thirdFormGroup.patchValue({
            current_supervisor_country_code: this.data.applicantData?.current_supervisor_country_code?.split("+")[0],
            previous_supervisor_country_code: this.data.applicantData?.previous_supervisor_country_code?.split("+")[0]
        })
    }
    //#endregion
}
