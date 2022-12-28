import { Component, Directive, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, startWith } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { states } from './../../../../../JSON/state';
import { HelpModalComponent } from './help-modal/help-modal.component';
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
    graduation_year: any;
    isLoading: boolean = false;
    states: string[] = [];
    countries: string[] = [];
    stateOptions: Observable<string[]>;
    countryOptions: Observable<string[]>;
    isImage: boolean = true;
    isState: boolean = false;
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        private _matDialog: MatDialog,

        breakpointObserver: BreakpointObserver
    ) {
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
    ngOnInit(): void {
        this.initForm();
        this.formUpdates();
        this.initCalendar();
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
    initForm() {
        this.firstFormGroup = this._formBuilder.group({
            id: [''],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
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
            home_phone_number: [''],
            avatar: ['', [Validators.required]],
        });
        this.thirdFormGroup = this._formBuilder.group({
            current_employer: [''],
            current_position_title: [''],
            current_description_of_role: [''],
            current_employement_period_start: [''],
            current_employement_period_end: [''],
            current_supervisor_reference: [''],
            current_supervisor_phone_number: [''],
            current_contact_supervisor: [false],

            previous_employer: ['', [Validators.required]],
            previous_position_title: ['', [Validators.required]],
            previous_description_of_role: ['', [Validators.required]],
            previous_employement_period_start: ['', [Validators.required]],
            previous_employement_period_end: ['', [Validators.required]],
            previous_supervisor_reference: ['', [Validators.required]],
            previous_supervisor_phone_number: ['', [Validators.required]],
            previous_contact_supervisor: ['', [Validators.required]],

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
            school_college: ['', [Validators.required]],
            degree_name: ['', [Validators.required]],
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
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f) => {
            Object.entries(f.value).forEach((element) => {
                const control = this._formBuilder.control(element[1]);
                this.form.addControl(element[0], control);
            });
        });
        this._applicantService.isLoadingApplicant.next(true);
        var formData: FormData = new FormData();
        formData.append('image', this.secondFormGroup.get('avatar').value);
        formData.append('form', JSON.stringify(this.form.value));
        this._applicantService.createApplicant(formData);
        this._router.navigateByUrl("/pages/landing-page")
    }
    initCalendar() {
        this.graduation_year = new FormControl(moment());
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
        this._router.navigateByUrl("/pages/landing-page")
        this.saveAsDraft();
        // Close the dialog
        // this.matDialogRef.close();
    }
    /**
     * Discard the message
     */
    discard(): void { }
    /**
     * Save the message as a draft
     */
    saveAsDraft(): void { }
    /**
     * Send the message
     */
    send(): void { }
    selectionChange(event) {
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

    //#region Form Value Updates
    formUpdates() {
        this.secondFormGroup?.get('country').valueChanges.subscribe((_formValue => {
            if (_formValue === "United States of America") {
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