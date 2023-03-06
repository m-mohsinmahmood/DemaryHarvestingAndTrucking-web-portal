import { ChangeDetectorRef, Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import moment, { Moment } from 'moment';
import { Machineries } from '../machinery.types';
import { MachineryService } from '../machinery.service';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { string } from 'joi';

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
    selector: 'app-updateadd',
    templateUrl: './update-add.component.html',
    styleUrls: ['./update-add.component.scss'],
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

export class UpdateAddMachineryComponent implements OnInit {

    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;

    form: FormGroup;
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    isSubmit = false;
    isBack = false;
    imageURL: string = '';
    //   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    routeID: string;
    avatar: string = '';
    year;
    pictures1Preview:string= '';
    pictures2Preview:string= '';
    pictures3Preview:string= '';




    //#region Observables
    machinery$: Observable<Machineries>;
    isLoadingMachinery$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion



    constructor(
        public matDialogRef: MatDialogRef<UpdateAddMachineryComponent>,
        private _formBuilder: FormBuilder,
        public _machineryService: MachineryService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
    ) {

    }

    ngOnInit(): void {
        this.initForm();
        this.initObservables();
        this.initCalendar();


        this._machineryService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._machineryService.closeDialog.next(false);
                }
            });


    }

    //#region init form
    initForm() {
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            type: ['', [Validators.required]],
            status: true,
            name: ['', [Validators.required]],
            serial_number: [''],
            engine_hours: [''],
            eh_reading: [''],
            separator_hours: [''],
            sh_reading: [''],
            company_id: ['', [Validators.required]],
            color: [''],
            year: [moment()],
            make: ['', [Validators.required]],
            model: [''],
            insurance_status: [''],
            liability: [''],
            collision: [''],
            comprehensive: [''],
            purchase_price: [''],
            date_of_purchase: [''],
            sales_price: [''],
            date_of_sales: [''],
            estimated_market_value: [''],
            source_of_market_value: [''],
            date_of_market_value: [''],
            pictures1: [''],
            pictures2: [''],
            pictures3: ['']


        });
        if (this.data) {
            this.form.patchValue({

                id: this.data.machineryData.id,
                type: this.data.machineryData.type,
                status: this.data.machineryData.status.toString(),
                name: this.data.machineryData.name,

                company_id: this.data.machineryData.company_id,
                color: this.data.machineryData.color,
                year: this.data.machineryData.year,
                make: this.data.machineryData.make,
                model: this.data.machineryData.model,

                serial_number: this.data.machineryData?.serial_number,
                engine_hours: this.data.machineryData.engine_hours,
                eh_reading: this.data.machineryData.eh_reading,
                separator_hours: this.data.machineryData.separator_hours,
                sh_reading: this.data.machineryData.sh_reading,

                insurance_status: this.data.machineryData.insurance_status,
                liability: this.data.machineryData.liability,
                collision: this.data.machineryData.collision,
                comprehensive: this.data.machineryData.comprehensive,
                purchase_price: this.data.machineryData.purchase_price,
                date_of_purchase: this.data.machineryData.date_of_purchase,
                sales_price: this.data.machineryData.sales_price,
                date_of_sales: this.data.machineryData.date_of_sales,
                estimated_market_value: this.data.machineryData.estimated_market_value,
                source_of_market_value: this.data.machineryData.source_of_market_value,
                date_of_market_value: this.data.machineryData.date_of_market_value,
                pictures: this.data.machineryData.pictures
            });
        }

    }
    //#endregion
    //#region Init Observables
    initObservables() {
        this.isLoadingMachinery$ = this._machineryService.isLoadingMachinery$;
        this.closeDialog$ = this._machineryService.closeDialog$;
    }
    //#endregion

    onSubmit(): void {
        this._machineryService.isLoadingMachinery.next(true);
        if (this.data) {
            this._machineryService.updateMachinery(this.form.value);
        } else {
            var formData: FormData = new FormData();
            formData.append('form', JSON.stringify(this.form.value));
            formData.append('image', this.form.get('pictures1').value);
            formData.append('image', this.form.get('pictures2').value);
            formData.append('image', this.form.get('pictures3').value);
            this._machineryService.createMachinery(formData);
        }
    }

    discard(): void {
        this._machineryService.isLoadingMachinery.next(false);
        this.matDialogRef.close();
    }

    //#region Init Calendar
    initCalendar() {
        //Calender Year Initilize
        if (this.data) {
            this.year = new FormControl(this.data.machineryData.year);

        } else {
            this.year = new FormControl(moment());
        }
    }
    //#endregion

    //#region Calendar Year Function
    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.year.value);
        ctrlValue.year(normalizedYear.year());
        this.year.setValue(ctrlValue);
        console.log(this.year.value);
        console.log(ctrlValue);

        this.form.value.year = ctrlValue;
        datepicker.close();
    }

    //#endregion

    //#region Upload Image
    uploadImage(event: any, picture) {
        
        if (
            event.target.files &&
            event.target.files[0] &&
            event.target.files[0].type.includes('image/')
        ) {
            const reader = new FileReader();
            if (picture === 'pictures1') {
                reader.onload = (_event: any) => {
                    this.pictures1Preview = event.target.files[0].name
                    this.form.controls['pictures1']?.setValue(event.target.files[0]);
                };
                reader.readAsDataURL(event.target.files[0]);
            } else  if (picture === 'pictures2') {
                reader.onload = (_event: any) => {
                    this.pictures2Preview = event.target.files[0].name
                    this.form.controls['pictures2']?.setValue(event.target.files[0]);
                };
                reader.readAsDataURL(event.target.files[0]);
            } else  if (picture === 'pictures3') {
                reader.onload = (_event: any) => {
                    this.pictures3Preview = event.target.files[0].name

                    this.form.controls['pictures3']?.setValue(event.target.files[0]);
                };
                reader.readAsDataURL(event.target.files[0]);
            }

        } else {
            this.form.controls[picture].setErrors({'incorrect': true});

        }
    }
    //#endregion



}
