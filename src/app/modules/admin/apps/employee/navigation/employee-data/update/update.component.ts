import { Component, Directive, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { states } from 'JSON/state';
import { countryList } from 'JSON/country';
import { date_format, date_format_2 } from 'JSON/date-format';

@Directive({
    selector: '[birthdayFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: date_format_2 },
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
        { provide: MAT_DATE_FORMATS, useValue: date_format },

    ],

})

export class UpdateEmployeeComponent implements OnInit {

    //#region observables
    isLoadingEmployee$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    // #region local variables
    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;
    form: FormGroup;
    formArr = [];
    employees: any;
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
    countries: string[] = [];
    stateOptions: Observable<string[]>;
    countryOptions: Observable<string[]>;
    isImage: boolean = true;
    isState: boolean = false;
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<UpdateEmployeeComponent>,
        private _formBuilder: FormBuilder,
        public _employeeService: EmployeeService,
        public _router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        breakpointObserver: BreakpointObserver
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        this.routeID = data.applicant_info ? data.applicant_info.id : '';
    }
    //#region Lifecycle hooks
    ngOnInit(): void {
        this.initEmployeeForm();
        this.initObservables();
        this.initCalendar();
        this.formUpdates();
        this._employeeService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._employeeService.closeDialog.next(false);
                }
            });

        this.states = states;
        this.countries = countryList;

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

    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //Auto Complete functions for State and Country

    private _filterStates(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.states.filter(state => state.toLowerCase().includes(filterValue));
    }

    private _filterCountries(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.countries.filter(country => country.toLowerCase().includes(filterValue));
    }

    // #region initializing forms
    initEmployeeForm() {
        this.firstFormGroup = this._formBuilder.group({
            id: ['' || this.data.id],
            first_name: ['' || this.data.employeeData.first_name, [Validators.required]],
            last_name: ['' || this.data.employeeData.last_name, [Validators.required]],
            email: ['' || this.data.employeeData.email, [Validators.required]],
            cell_phone_number: ['' || this.data.employeeData.cell_phone_number, [Validators.required]],
            home_phone_number: ['' || this.data.employeeData.home_phone_number],
            date_of_birth: ['' || this.data.employeeData.date_of_birth, [Validators.required]],
            age: ['' || this.data.employeeData.age, [Validators.required]],
            marital_status: ['' || this.data.employeeData.marital_status, [Validators.required]],
            languages: ['' || this.data.employeeData.languages.replace(/\s/g, '').split(','), [Validators.required]],
            rank_speaking_english: ['' || this.data.employeeData.rank_speaking_english, [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            address_1: ['' || this.data.employeeData.address_1, [Validators.required]],
            address_2: ['' || this.data.employeeData.address_2],
            town_city: ['' || this.data.employeeData.town_city, [Validators.required]],
            county_providence: ['' || this.data.employeeData.county_province, [Validators.required]],
            state: ['' || this.data.employeeData.state],
            postal_code: ['' || this.data.employeeData.postal_code, [Validators.required]],
            country: ['' || this.data.employeeData.country, [Validators.required]],
            avatar: ['' || this.data.employeeData.avatar],
        });

        this.thirdFormGroup = this._formBuilder.group({
            question_1: ['' || this.data.employeeData.question_1, [Validators.required]],
            question_2: ['' || this.data.employeeData.question_2, [Validators.required]],
            question_3: ['' || this.data.employeeData.question_3, [Validators.required]],
            question_4: ['' || this.data.employeeData.question_4, [Validators.required]],
            question_5: ['' || this.data.employeeData.question_5, [Validators.required]],
            authorized_to_work: ['' || this.data.employeeData.authorized_to_work.toString(), [Validators.required]],
            us_citizen: ['' || this.data.employeeData.us_citizen.toString(), [Validators.required]],
            cdl_license: ['' || this.data.employeeData.cdl_license.toString(), [Validators.required]],
            lorry_license: ['' || this.data.employeeData.lorry_license.toString(), [Validators.required]],
            tractor_license: ['' || this.data.employeeData.tractor_license.toString(), [Validators.required]],
            passport: ['' || this.data.employeeData.passport.toString(), [Validators.required]],
            work_experience_description: ['' || this.data.employeeData.work_experience_description.toString(), [Validators.required]],
            employment_period: ['' || this.data.employeeData.employment_period, [Validators.required]],
        });

        this.fourthFormGroup = this._formBuilder.group({
            supervisor_name: ['' || this.data.employeeData.supervisor_name, [Validators.required]],
            supervisor_contact: ['' || this.data.employeeData.supervisor_contact, [Validators.required]],
            degree_name: ['' || this.data.employeeData.degree_name, [Validators.required]],
            reason_for_applying: ['' || this.data.employeeData.reason_for_applying, [Validators.required]],
            hear_about_dht: ['' || this.data.employeeData.hear_about_dht, [Validators.required]],
        });

        this.fifthFormGroup = this._formBuilder.group({
            us_phone_number: ['' || this.data.employeeData.us_phone_number],
            blood_type: ['' || this.data.employeeData.blood_type],
            unique_fact: ['' || this.data.employeeData.unique_fact],
            emergency_contact_name: ['' || this.data.employeeData.emergency_contact_name],
            emergency_contact_phone: ['' || this.data.employeeData.emergency_contact_phone],

        });
        this.formArr = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup,
            this.fifthFormGroup,
        ];
    }
    // #endregion

    //#region Init Observables
    initObservables() {
        this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
        this.closeDialog$ = this._employeeService.closeDialog$;
    }
    //#endregion

    //#region Init Calendar
    initCalendar() {
        //Calender Year Initilize
        if (this.data) {
            this.calendar_year = new FormControl(this.data.calendar_year);

        } else {
            this.calendar_year = new FormControl(moment());
        }
    }
    //#endregion

    //#region Form methods
    submit(): void {
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach((element) => {
                const control = this._formBuilder.control(element[1]);
                this.form.addControl(element[0], control);
            });
        });
        this._employeeService.isLoadingEmployee.next(true);
        this.form.value['languages'] = this.form.value['languages'].join(', ');
        this._employeeService.updateEmployee(this.data.id, this.form.value);

    }

    discard(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

    //#endregion

    //#region Calendar Year Function
    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.secondFormGroup.value.calendar_year = ctrlValue;
        datepicker.close();
    }

    //#endregion

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

    //#region Form update
    formUpdates() {
        this.secondFormGroup?.valueChanges.subscribe((_formValues => {
            if (_formValues["country"] === "United States of America") {
                this.secondFormGroup.controls['state'].enable({ emitEvent: false });
                this.isState = true;
            }
            else {
                this.isState = false;
                this.secondFormGroup.controls['state'].setValue('');
                this.secondFormGroup.controls['state'].disable({ emitEvent: false });
            }
        }));
    }
    //#endregion
}
