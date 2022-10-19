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
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { CropService } from 'app/modules/admin/apps/crops/crops.services';

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
    selector: 'app-add-crop',
    templateUrl: './add-crop.component.html',
    styleUrls: ['./add-crop.component.scss'],
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
export class AddCropComponent implements OnInit {

    //#region  Local Variables
    selectedValue: string;
    form: FormGroup;
    date = new FormControl(moment());
    isLoadingCrops$: Observable<boolean>;
    calendar_year;
    customerCropData: any;
    //#endregion

    //#region Observables
    closeDialog$: Observable<boolean>;
    //#endregion

    //#region Auto Complete Farms
    allCrops: Observable<any>;
    crop_search$ = new Subject();
    //#endregion
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropComponent>,
        public _customerService: CustomersService,
        public _cropService: CropService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
    //#region Lifecycle Functions
    ngOnInit(): void {
        this.customerCropData = this.data.customerCropData;
        this.initForm();
        this.cropSearchSubscription();

        // Dialog Close
        this.closeDialog$ = this._customerService.closeDialog$;
        this._customerService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._customerService.closeDialog.next(false);
                }
        });
        //Calender Year Initilize
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.customerCropData.calendar_year);
        } else {
            this.calendar_year = new FormControl(moment());
        }

    }

    ngAfterViewInit(): void {


    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region  Form
    initForm(): void {
         // Create the form
         this.form = this._formBuilder.group({
            id: [''],
            customer_id: this.data.customer_id,
            crop_id: ['', [Validators.required]],
            calendar_year: ['2022'],
            status: true
        });

        if(this.data && this.data.isEdit){
            console.log(this.customerCropData.id);
            this.form.patchValue({
                customer_id: this.data.customer_id,
                id: this.customerCropData.id,
                crop_id: {id: this.customerCropData.crop_id, name: this.customerCropData.crop_name},
                calendar_year: this.customerCropData.calendar_year,
                status: this.customerCropData.status.toString(),
            });
        }
    }
    onSubmit(): void {
        this.form.value['crop_id'] = this.form.value['crop_id']?.id;
        if (this.data && this.data.isEdit) {
            this._customerService.updateCustomerCrops(this.form.value);
        } else {
            this._customerService.createCustomerCrops(this.form.value);
        }
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
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
        this.form.value.calendar_year = ctrlValue;
        datepicker.close();
    }

    //#endregion

    //#region Auto Complete Crops Display Function
    displayCropForAutoComplete(crop: any) {
        return crop ? `${crop.name}` : undefined;
    }
    //#endregion

    //#region Search Function
    cropSearchSubscription() {
        this.crop_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allCrops = this._cropService.getCropsAll(
                    value
                );
            });
    }
    //#endregion

}
