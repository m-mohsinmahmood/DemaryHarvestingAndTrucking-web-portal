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

interface Calender {
    value: string;
    viewValue: string;
  }
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




  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddDestinationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        // this.activatedRoute.params.subscribe((params) => {
        //     console.log('ddddd',params);
        //     this.routeID = params.Id;
        // });

        // passing year value on page opening/rendering
        this.calendar_year = new FormControl(this.data.farmdata.calenderYear);

        this.isLoadingDestination$ = this._customerService.is_loading_destination$;
        this.closeDialog$ = this._customerService.closeDialog$;
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });

        // Create the form
        this.form = this._formBuilder.group({
            farmName     : ['', [Validators.required]],
            name     : ['', [Validators.required]],
            calendar_year: [],
            // date: ['', []],
          });
          if (this.data?.farmdata && this.data?.farmdata.isEdit) {
            this.form.patchValue({
                farmName: this.data.farmdata.farmName,
                name: this.data.farmdata.name,
                calendar_year: this.data.farmdata.calendar_year,
            });

        }

      }

      onSubmit(): void {

        console.log('sss',this.data);
        console.log('ddd',this.form.value);
        const payload_update ={
            id: this.data?.farmdata?.destination_id,
            customer_id: this.data?.farmdata?.customer_id,
            farm_id: this.data?.farmdata?.farmId,
            name: this.form.value.name,
            calendar_year:  moment(this.form.value.calendar_year).format('YYYY/MM/DD'),
        };
        const payload_create ={
            // id: 'ea384f4a-10d5-4042-927b-8b2edf2be3ab',
            customer_id: this.data.customer_id,
            farm_id: '7485bb10-f0d4-4535-acf1-8f70445d967c',
            name: this.form.value.name,
            calendar_year: moment(this.date.value).format('YYYY/MM/DD'),
        };
        // console.log('Payload Data:',payload_create);
        console.log('Payload Data:',payload_create);

        if (this.data?.farmdata && this.data?.farmdata.isEdit) {
            this.updateDestination(payload_update);
        } else {
            this.createDestination(payload_create);
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
        console.log('UPdated Data:',data);
        this._customerService.updateCustomerDestination(data, this.data.paginationData);
    }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = moment(this.calendar_year.value);
    ctrlValue.year(normalizedYear.year());
    this.calendar_year.setValue(ctrlValue);
        this.form.value.calendar_year = ctrlValue;
    datepicker.close();

  }


}


