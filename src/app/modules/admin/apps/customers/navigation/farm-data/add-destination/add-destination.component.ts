/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';

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

@Component({
    selector: 'app-add-destination',
    templateUrl: './add-destination.component.html',
    styleUrls: ['./add-destination.component.scss'],
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
export class AddDestinationComponent implements OnInit, OnDestroy {
    selectedValue: string;
    form: FormGroup;
    closeDialog$: Observable<boolean>;
    routeID: any;
    status: boolean;
    isLoadingDestination$: Observable<boolean>;
    date = new FormControl(moment());
    calendar_year;
    customerDestination: any;

    //#region Auto Complete Farms
    allFarms: Observable<any>;
    farm_search$ = new Subject();
    //#endregion
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddDestinationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _customerService: CustomersService,
        public activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // passing year value on page opening/rendering
        // this.calendar_year = new FormControl(this.data.farmdata.calenderYear);
        this.customerDestination = this.data.customerDestinationData;
        this.closeDialog$ = this._customerService.closeDialog$;
        this.farmSearchSubscription();
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });
        if (this.data?.isEdit) {
            this.calendar_year = new FormControl(
                this.data?.customerDestinationData?.calendar_year
            );
        } else {
            this.calendar_year = new FormControl(moment());
        }

        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: this.data.customer_id,
            farm_id: ['', [Validators.required]],
            name: ['', [Validators.required]],
            calendar_year: [''],
            status: true,
        });

        // Update the form
        if (this.data?.customerDestinationData && this.data?.isEdit) {
          const { customerDestinationData } = this.data;
            this.form.patchValue({
              id: customerDestinationData.id,
              customer_id: this.data.customer_id,
              farm_id: {id: customerDestinationData.farm_id, name: customerDestinationData.farm_name},
              name: customerDestinationData.name,
              calendar_year: customerDestinationData.calendar_year,
              status: customerDestinationData.status
            });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onSubmit(): void {
        this.form.value['farm_id'] = this.form.value['farm_id']?.id;

        if (this.data && this.data?.isEdit) {
            this._customerService.createCustomerDestination(this.form.value);
        } else {
            this._customerService.updateCustomerDestination(this.form.value);
        }
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
        datepicker.close();
    }

    //#region Auto Complete Farms Display Function
    displayFarmForAutoComplete(farm: any) {
        return farm ? `${farm.name}` : undefined;
    }

    farmSearchSubscription() {
        this.farm_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allFarms = this._customerService.getCustomerFarmsAll(
                    this.data.customer_id,
                    value
                );
            });
    }
    //#endregion
}
