/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Observable } from 'rxjs';
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
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AddDestinationComponent implements OnInit {
    selectedValue: string;
    form: FormGroup;
    closeDialog$: Observable<boolean>;
    routeID: any;
    isLoadingDestination$: Observable<boolean>;
    date = new FormControl(moment());
    calendar_year;
    customerDestination: any;
  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddDestinationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        // passing year value on page opening/rendering
        this.calendar_year = new FormControl(this.data.farmdata.calendarYear);
        this.customerDestination = this.data.customerDestinationData;
        this.closeDialog$ = this._customerService.closeDialog$;
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });
        if (this.data.isEdit) {
            this.calendar_year = new FormControl(this.data.farmdata?.calendarYear);
        } else {
            this.calendar_year = new FormControl(moment());
        }

        // Create the form
        this.form = this._formBuilder.group({
            farmName     : ['', [Validators.required]],
            name     : ['', [Validators.required]],
            calendar_year: [],
            // date: ['', []],
          });
          if (this.data?.farmdata && this.data?.farmdata.isEdit) {
            this.form.patchValue({
                farm_name: this.customerDestination.farm_name,
                name: this.customerDestination.name,
                calendar_year: this.customerDestination.calendar_year,
            });

        }

      }

      onSubmit(): void {
        const payloadUpdate ={
            customer_id: this.data?.customer_id,
            id: this.customerDestination?.destination_id,
            farm_id: this.customerDestination?.farm_id,
            name: this.form.value.name,
            calendar_year:  moment(this.form.value.calendar_year).format('YYYY/MM/DD'),
        };
        const payloadCreate ={
            // id: 'ea384f4a-10d5-4042-927b-8b2edf2be3ab',
            customer_id: this.data.customer_id,
            farm_id: '7485bb10-f0d4-4535-acf1-8f70445d967c',
            name: this.form.value.name,
            calendar_year: moment(this.form.value.calendar_year).format('YYYY/MM/DD'),
        };
        if (this.data && this.data?.isEdit) {
            this.updateDestination(payloadUpdate);
        } else {
            this.createDestination(payloadCreate);
        }
      }

      saveAndClose(): void
      {
          this.matDialogRef.close();
      }


      discard(): void
      {
        this.matDialogRef.close();
      }

      createDestination(data: any): void {
        this._customerService.createCustomerDestination(data);
    }
    updateDestination(data: any): void {
        this._customerService.updateCustomerDestination(data);
    }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = moment(this.calendar_year.value);
    ctrlValue.year(normalizedYear.year());
    this.calendar_year.setValue(ctrlValue);
    this.form.value.calendar_year = ctrlValue;
    datepicker.close();
  }


}


