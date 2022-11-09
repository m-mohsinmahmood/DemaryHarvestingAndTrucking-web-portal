import { Component, OnInit, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../../customers.service';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};
@Component({
    selector: 'app-add-field',
    templateUrl: './add-field.component.html',
    styleUrls: ['./add-field.component.scss'],
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
export class AddFieldComponent implements OnInit, OnDestroy {

    //#region Observables
    isLoadingCustomerField$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion

    //#region Local Variables
    selectedValue: string;
    form: FormGroup;
    calendar_year;
    isEdit: boolean;
    status: boolean;
    customerFieldData: any;
    //#endregion

    //#region Auto Complete Farms
    allFarms: Observable<any>;
    farm_search$ = new Subject();
    //#endregion

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddFieldComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    //#region Lifecycle Functions

    ngOnInit(): void {
        this.initObservables();
        this.initForm();
        this.farmSearchSubscription();
        this.initCalendar();
        this.initFieldFormGroup();
        // Dialog Close
        this._customersService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._customersService.closeDialog.next(false);
                }
            });
    }
    AfterViewInit(): void { }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //#endregion

    //#region Init Observables 
    initObservables() {
        this.isLoadingCustomerField$ = this._customersService.isLoadingCustomerField$
        this.closeDialog$ = this._customersService.closeDialog$;
    }
    //#endregion

    //#region init Field Form
    initFieldFormGroup() {
        const fieldFormGroup = [];
        fieldFormGroup.push(
            this._formBuilder.group({
                name: [''],
                acres: [''],
                calendar_year: [moment()],
                status: ['']

            })
        );
        fieldFormGroup.forEach((fieldFormGroup) => {
            (this.form.get('fields') as FormArray).push(fieldFormGroup);
        });
    }
    //#endregion

    //#region Initilize Calendar
    initCalendar() {
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.data.customerFieldData.calendar_year);
        } else {
            this.calendar_year = new FormControl(moment());
        }
    }
    //#endregion

    //#region Form
    initForm() {
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            farm_id: [''],
            customer_id: this.data.customer_id,
            fields: this._formBuilder.array([]),
        });
        if (this.data && this.data.isEdit) {
            const { customerFieldData, customer_id } = this.data;
            this.form.patchValue({
                customer_id: customer_id,
                id: customerFieldData.field_id,
                farm_id: { id: customerFieldData.farm_id, name: customerFieldData.farm_name },
                //fields: customerFieldData.field_name,
            });
        }
    }
    addField(): void {
        const fieldGroup = this._formBuilder.group({
            name: [''],
            acres: [''],
            calendar_year: [moment()],
            status: ['']
        });

        (this.form.get('fields') as FormArray).push(fieldGroup);
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeField(index: number): void {
        // Get form array for emails
        const fieldFormArray = this.form.get('fields') as FormArray;

        // Remove the email field
        fieldFormArray.removeAt(index);

    }

    onSubmit(): void {
        this._customersService.isLoadingCustomerField.next(true);
        this.form.value['farm_id'] = this.form.value['farm_id']?.id;
        if (this.data && this.data.isEdit) {
            this._customersService.updateCustomerField(this.form.value);

        } else {
            this._customersService.createCustomerField(this.form.value);
        }
        if (this.form.valid) {
            this.form.reset();
        }

    }

    discard(): void {
        this._customersService.isLoadingCustomerField.next(false);
        this.matDialogRef.close();
    }
    
    getDropdownFarms() {
        let value = this.form.controls['farm_id'].value;
        this.allFarms = this._customersService.getDropdownCustomerFarms(this.data.customer_id, value);
    }
    //#endregion

    //#region Calendar Year Function
    chosenYearHandler(normalizedYear: Moment, dp: any , index: number) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.fields[index].calendar_year = ctrlValue;
        dp.close();
    }
    //#endregion

    //#region Auto Complete Farms Display Function
    displayFarmForAutoComplete(farm: any) {
        return farm ? `${farm.name}` : undefined;
    }
    //#endregion

    //#region  Search Function
    farmSearchSubscription() {
        this.farm_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allFarms = this._customersService.getDropdownCustomerFarms(
                    this.data.customer_id,
                    value
                );
            });
    }
    //#endregion

}
