/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';
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

interface Calender {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-add-farm',
    templateUrl: './add-farm.component.html',
    styleUrls: ['./add-farm.component.scss'],
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
export class AddRealFarmComponent implements OnInit {
    selectedValue: string;
    form: FormGroup;
    calendar_year;
    isEdit: boolean;

    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddRealFarmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
    this.isEdit = this.data.isEdit;
        this._customersService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customersService.closeDialog.next(false);
            }
        });
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: this.data.id,
            name:  ['',[Validators.required]]

        });
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                id: this.data.id,
                name: this.data.name,
                customer_id: this.data.customer_id,
            });
        }
    }


    onSubmit(): void {
        this._customersService.isLoadingCustomerFarm.next(true);
        if (this.data && this.data.isEdit) {
            this.updateCustomerFarm(this.form.value);
        } else {
            this.createCustomerFarm(this.form.value);
        }
    }

    createCustomerFarm(customerFarmData: any): void {
        this._customersService.createCustomerFarm(customerFarmData);
    }
    updateCustomerFarm(customerFarmData: any): void {
        this._customersService.updateCustomerFarm(
            customerFarmData,
            this.data.paginationData
        );
    }

    saveAndClose(): void {
        this._customersService.isLoadingCustomerFarm.next(false);
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
    enableEditButton() {
        this.isEdit = false;
    }

    disableEditButton() {
        this.isEdit = true;
    }
}
