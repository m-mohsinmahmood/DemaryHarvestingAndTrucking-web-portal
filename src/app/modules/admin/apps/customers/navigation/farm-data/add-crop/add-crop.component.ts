/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS
  } from '@angular/material-moment-adapter';
  import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
  } from '@angular/material/core';
  import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs';


export const MY_FORMATS = {
    parse: {
      dateInput: 'YYYY'
    },
    display: {
      dateInput: 'YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
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
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
      ]
})
export class AddCropComponent implements OnInit {
    selectedValue: string;
    form: FormGroup;
    date = new FormControl(moment());
    isLoadingCrops$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    calendar_year;

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _customerService: CustomersService,

    ) {}

    ngOnInit(): void {
        // this.isLoadingCrops$ = this._customerService.is_loading_crops$;
        this.closeDialog$ = this._customerService.closeDialog$;
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });

        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.data.calendarYear);
        } else {
            this.calendar_year = new FormControl(moment());
        }

        // Create the form
        this.form = this._formBuilder.group({
            cropName: ['', [Validators.required]],
            status  : true,
            calendar_year: [],
        });
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                cropName: this.data.cropName,
                status: this.data.status.toString(),
                calendar_year: this.data.calenderYear,
            });
        }
    }

    onSubmit(): void {
        const payloadCreate ={
            customer_id: this.data.customer_id,
            crop_id: '2aed9f4a-37ca-45c4-80d1-0c069a6b6fd6',
            calendar_year: moment(this.form.value.calendar_year).format('YYYY/MM/DD'),
            status: false
        };
        this.createCrop(payloadCreate);
    }
    createCrop(data){
       this._customerService.createCustomerCrops(data);
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = moment(this.calendar_year.value);
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
        datepicker.close();
      }
}
