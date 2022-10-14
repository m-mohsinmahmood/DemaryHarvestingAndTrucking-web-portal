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
import { debounceTime, distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs';

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
export class AddFarmComponent implements OnInit {
    selectedValue: string;
    form: FormGroup;
    calendar_year;
    isEdit: boolean;

    calenderYear: Calender[] = [
        { value: '22', viewValue: '2022' },
        { value: '21', viewValue: '2021' },
        { value: '20', viewValue: '2020' },
        { value: '19', viewValue: '2019' },
        { value: '18', viewValue: '2018' },
        { value: '17', viewValue: '2017' },
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddFarmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
    this.isEdit = this.data.isEdit;
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.data.calendar_year);
        } else {
            this.calendar_year = new FormControl(moment());
        }
        this._customersService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customersService.closeDialog.next(false);
            }
        });
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            farm_id: [''],
            customer_id: this.data.id,
            name: ['', [Validators.required]],
            acres: ['', [Validators.required]],
            calendar_year: [moment()],
        });
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                id: this.data.field_id,
                farm_id: this.data.farm_id,
                customer_id: this.data.customer_id,
                name: this.data.field_name,
                acres: this.data.acres,
                calendar_year: this.data.calendar_year,
            });
        }

        this.farmSearchSubscription = this.farm_search$
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe((value: string) => {
                this.allFarms = this._customersService.getCustomerFarmsAll("b2e8e34a-1fa5-46c8-a0b9-5ecfa40e6769", value);
            });
    }

    chosenYearHandler(normalizedYear: Moment, dp: any) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
        dp.close();
    }

    onSubmit(): void {
        this._customersService.isLoadingCustomerField.next(true);
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
        this._customersService.updateCustomerField(
            customerFieldData,
            this.data.paginationData
        );
    }

    saveAndClose(): void {
        this._customersService.isLoadingCustomerField.next(false);
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
    enableEditButton() {
        this.isEdit = false;
    }

    disableEditButton() {
        // this.isEdit = true;
        this.matDialogRef.close();

    }

    //Auto Complete//
    //Client//
    allFarms: Observable<any>;
    allFarmsSubscription: Subscription;
    farm_search$ = new Subject();
    farmSearchSubscription: Subscription;

    // Client Auto Complete Functions //
    clientClick() {
        // let value = this.contactForm.controls['clientId'].value;

        // if(value !=undefined && value != '' && typeof value == 'object') {
        //     value.name = this.handleApostrophe(value.name);
        //     this.allFarms = this._.getAllClients(value.name);
        // } else {
            // value = this.handleApostrophe(value);
            // this.allFarms = this._clientService.getAllClients(value);
        // }
    }

    farmSelect(client: any) {
        // this.allFarmsSubscription = this.allFarms.subscribe((res) => {
        //     this.contactForm.controls["licenseId"].setValue(res.filter((x) => x.uuid == client.uuid)[0].licenseId);
        // });
    }

    displayFarmForAutoComplete(farm: any) {
        return farm ? `${farm.name}` : undefined;
    }
    // Client Auto Complete Functions //
    //Client//
    //Auto Complete//
}
