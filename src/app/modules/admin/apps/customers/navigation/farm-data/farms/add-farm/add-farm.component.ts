import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import {
    FormBuilder,
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
import { Observable, Subject } from 'rxjs';


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

    //#region Observables
    isLoadingCustomerFarm$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion

    //#region Local Variables
    selectedValue: string;
    form: FormGroup;
    calendar_year;
    customerFarmData: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddFarmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initObservables();
        this.initForm();
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
    ngAfterViewInit(): void { }


    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion
    //#region Init Observables 
    initObservables() {
        this.isLoadingCustomerFarm$ = this._customersService.isLoadingCustomerFarm$
        this.closeDialog$ = this._customersService.closeDialog$;

    }
    //#endregion

    //#region Form
    initForm() {
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: this.data.id,
            name: ['', [Validators.required]],
            status: true,
        });
        if (this.data && this.data.isEdit) {
            const {customerFarmData , customer_id} = this.data
            this.form.patchValue({
                customer_id: customer_id,
                id: customerFarmData.id,
                name: customerFarmData.name,
                status: customerFarmData.status.toString(),
            });
        }
    }
    onSubmit(): void {
        this._customersService.isLoadingCustomerFarm.next(true);
        if (this.data && this.data.isEdit) {
            this._customersService.updateCustomerFarm(this.form.value);
        } else {
            this._customersService.createCustomerFarm(this.form.value);
        }
    }
    discard(): void {
        this._customersService.isLoadingCustomerFarm.next(false);
        this.matDialogRef.close();
    }

    //#endregion
}
