import { Component, Directive, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, startWith, Subject, takeUntil, debounceTime, lastValueFrom } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { states } from './../../../../../JSON/state';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { countryList } from 'JSON/country';
import { Country } from './applicants.types';
import { ContentObserver } from '@angular/cdk/observers';


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
export const MY_FORMATS_3 = {
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
@Directive({
    selector: '[fullDate]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_3 },
    ],
})

export class FullDate {
}


@Component({
    selector: 'app-applicantpage',
    templateUrl: './applicantpage.component.html',
    styleUrls: ['./applicantpage.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ApplicantpageComponent implements OnInit {

    // #region local variables
    panelOpenState = false;
    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
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
    routeID: string;
    avatar: string = '';
    isEdit: boolean = true;
    formArr = [];
    graduation_year: any;
    isLoading: boolean = false;
    states: string[] = [];
    countryList: string[] = [];
    stateOptions: Observable<string[]>;
    countryOptions: Observable<string[]>;
    isImage: boolean = true;
    isState: boolean = false;
    resumePreview: string = '';
    countryCode: Country[];
    countries: Country[];
    countryCodeLength: any = 1;
    validCountry: boolean = false;
    validState: boolean = false;
    step: number = 0;
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        private _matDialog: MatDialog,

        breakpointObserver: BreakpointObserver
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this.initObservables();
        this.initForm();
        this.formUpdates();
        this.initCalendar();
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
    initForm() {
        this.firstFormGroup = this._formBuilder.group({
            id: [''],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")], this.asyncValidator.bind(this)],
            date_of_birth: ['', [Validators.required]],
            age: ['', [Validators.required]],
            marital_status: ['', [Validators.required]],
            languages: ['', [Validators.required]],
            rank_speaking_english: ['', [Validators.required]],
            passport: ['', [Validators.required]],
            us_citizen: ['', [Validators.required]],
        });
        this.secondFormGroup = this._formBuilder.group({
            address_1: ['', [Validators.required]],
            address_2: [''],
            town_city: ['', [Validators.required]],
            county_providence: ['', [Validators.required]],
            state: ['',],
            postal_code: ['', [Validators.required]],
            country: ['', [Validators.required]],
            cell_phone_number: ['', [Validators.required]],
            cell_phone_country_code: ['zz', [Validators.required, Validators.pattern("^(?:(?!zz).)*$")]],
            home_phone_number: [''],
            home_phone_country_code: ['zz',],
            avatar: ['', [Validators.required]],
        });
        this.thirdFormGroup = this._formBuilder.group({
            current_employer: [''],
            current_position_title: [''],
            current_description_of_role: [''],
            current_employment_period_start: [''],
            current_employment_period_end: [''],
            current_supervisor_reference: [''],
            current_supervisor_phone_number: [''],
            current_supervisor_country_code: ['zz'],
            current_contact_supervisor: [false],

            previous_employer: ['', [Validators.required]],
            previous_position_title: ['', [Validators.required]],
            previous_description_of_role: ['', [Validators.required]],
            previous_employment_period_start: ['', [Validators.required]],
            previous_employment_period_end: ['', [Validators.required]],
            previous_supervisor_reference: ['', [Validators.required]],
            previous_supervisor_phone_number: [''],
            previous_supervisor_country_code: ['zz'],
            previous_contact_supervisor: ['', [Validators.required]],
            resume: [''],
            authorized_to_work: ['', [Validators.required]],
            cdl_license: ['', [Validators.required]],
            lorry_license: ['', [Validators.required]],
            tractor_license: ['', [Validators.required]],
            question_1: ['', [Validators.required]],
            question_2: ['', [Validators.required]],
            question_3: ['', [Validators.required]],
            question_4: ['', [Validators.required]],
            question_5: ['', [Validators.required]],

            work_experience_description: ['', [Validators.required]],


        });
        this.fourthFormGroup = this._formBuilder.group({
            school_college: [''],
            degree_name: [''],
            graduation_year: [moment(), [Validators.required]],
            reason_for_applying: ['', [Validators.required]],
            hear_about_dht: ['', [Validators.required]],
            unique_fact: [''],
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
    }
    // #endregion
    submit(): void {
        //Merge all stepper forms in one form
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach((element) => {
                const control = this._formBuilder.control(element[1]);
                this.form.addControl(element[0], control);
            });
        });
        this._applicantService.isLoadingApplicant.next(true);
        //Filtered and replace country iso with country code in form
        this.getCountryByCode('cell_phone_country_code');
        this.getCountryByCode('home_phone_country_code');
        this.getCountryByCode('current_supervisor_country_code');
        this.getCountryByCode('previous_supervisor_country_code');

        var formData: FormData = new FormData();
        formData.append('image', this.secondFormGroup.get('avatar').value);
        if (this.thirdFormGroup.get('resume').value) {
            formData.append('resume', this.thirdFormGroup.get('resume').value);
        }
        formData.append('form', JSON.stringify(this.form.value));
        this._applicantService.createApplicant(formData, true);
    }
    initCalendar() {
        this.graduation_year = new FormControl(moment());
    }
    //#region Init Observables
    initObservables() {
        this._applicantService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    //#endregion
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
    saveAndClose(): void {
        this._router.navigateByUrl("/pages/landing-page")
        // Close the dialog
        // this.matDialogRef.close();
    }
    discard(): void {

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

    //#region Open Help Modal
    openHelpDialog(): void {
        const dialogRef = this._matDialog.open(HelpModalComponent, {
            data: {},
        });
        dialogRef.afterClosed().pipe().subscribe((result) => {
            //Call this function only when success is returned from the create API call//
        });
    }

    //#endregion

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
                // this.secondFormGroup.controls['state'].enable({ emitEvent: false });
                this.isState = true;
                this.secondFormGroup.controls['state'].setValue('');
            }
            else {
                this.isState = false;
                // this.secondFormGroup.controls['state'].setValue('');
                // this.secondFormGroup.controls['state'].disable({ emitEvent: false });
            }
        }));
    }
    isMacintosh() {
        return navigator.platform.indexOf('Mac') > -1
    }

    //#endregion

    //#region Country Form Validation
    formValidation(e, type) {
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
    getCountryByIso(iso: string): Country {
        const country = this.countries.find(country => country.iso === iso);
        this.countryCodeLength = country.code.length
        return country;
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    //#endregion

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


