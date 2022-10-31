/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
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

    //#region Local Variables
    selectedValue: string;
    form: FormGroup;
    calendar_year;
    isEdit: boolean;
    status: boolean;
    customerFieldData: any;
    //#endregion

    //#region Observables
    closeDialog$: Observable<boolean>;
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
    ) {}

    //#region Lifecycle Functions

    ngOnInit(): void {
        this.customerFieldData = this.data.customerFieldData;
        this.initForm();
        this.farmSearchSubscription();
        // Dialog Close
        this.closeDialog$ = this._customersService.closeDialog$;
        this._customersService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._customersService.closeDialog.next(false);
                }
          });

        //Calender Year Initilize
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.customerFieldData.calendar_year);
        } else {
            this.calendar_year = new FormControl(moment());
        }


    }
    AfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //#endregion

    //#region Form
    initForm() {
      // Create the form
    this.form = this._formBuilder.group({
        id: [''],
        farm_id: [''],
        customer_id: this.data.customer_id,
        name: ['', [Validators.required]],
        acres: [''],
        status : true,
        calendar_year: [moment()],
    });
    if (this.data && this.data.isEdit) {
        this.form.patchValue({
            customer_id: this.data.customer_id,
            id: this.customerFieldData.field_id,
            farm_id: {id: this.customerFieldData.farm_id, name: this.customerFieldData.farm_name},
            name: this.customerFieldData.field_name,
            acres: this.customerFieldData.acres,
            status: this.customerFieldData.status.toString(),
            calendar_year: this.customerFieldData.calendar_year,
        });
        }
    }
    onSubmit(): void {
        this._customersService.isLoadingCustomerField.next(true);
        this.form.value['farm_id'] = this.form.value['farm_id']?.id;
        if (this.data && this.data.isEdit) {
            this.updateCustomerField(this.form.value);
        } else {
            this.createCustomerField(this.form.value);
        }
    }

    createCustomerField(customerFieldData: any): void {
        this._customersService.createCustomerField(customerFieldData);
    }

    updateCustomerField(customerFieldData: any): void {
        this._customersService.updateCustomerField(customerFieldData);
    }

    saveAndClose(): void {
        this._customersService.isLoadingCustomerField.next(false);
        this.matDialogRef.close();
    }
    discard(): void {
        this.matDialogRef.close();
    }

    //#endregion

    //#region Calendar Year Function
    chosenYearHandler(normalizedYear: Moment, dp: any) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
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
            this.allFarms = this._customersService.getCustomerFarmsAll(
                this.data.customer_id,
                value
            );
        });
    }
    //#endregion

}
