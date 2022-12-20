
import { ChangeDetectorRef, Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { Motorized } from '../motorized.types';
import { MotorizedService } from '../motorized.service';
import { takeUntil } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

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
export const MY_FORMATS_2 = {
  parse: {
      dateInput: 'LL',
  },
  display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Directive({
  selector: '[birthdayFormat]',
  providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_2 },
  ],
})
export class BirthDateFormat {
}


@Component({
  selector: 'app-updateadd',
  templateUrl: './update-add.component.html',
  styleUrls: ['./update-add.component.scss'],
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
// @Inject(MAT_DIALOG_DATA)

export class UpdateAddMotorizedComponent implements OnInit {

  roles: string[] = ['single', 'Married', 'Divorced'];
  stepperOrientation: Observable<StepperOrientation>;

  form: FormGroup;
  employees: any;
  flashMessage: 'success' | 'error' | null = null;
  isSubmit = false;
  isBack = false;
  imageURL: string = '';
//   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
  routeID: string;
  avatar: string = '';
  year;

      //#region Observables
      motorized$: Observable<Motorized>;
      isLoadingMotorized$: Observable<boolean>;
      closeDialog$: Observable<boolean>;
      private _unsubscribeAll: Subject<any> = new Subject<any>();
      //#endregion



  constructor(
    public matDialogRef: MatDialogRef<UpdateAddMotorizedComponent>,
    private _formBuilder: FormBuilder,
    public _motorizedService: MotorizedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
   ) {
    
    }

  ngOnInit(): void {
    this.initForm();
    this.initCalendar();


    this._motorizedService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._motorizedService.closeDialog.next(false);
            }
        });
  }

  initForm() {
    // Create the form
  this.form = this._formBuilder.group({
    id                          : [''],
    type                        : ['', [Validators.required]],
    status                      : true,
    name                        : ['', [Validators.required]],
    license_plate               : [''],
    vin_number                  : [''],
    odometer                    : [''],
    odometer_reading            : [''],
    company_id                  : ['', [Validators.required]],
    color                       : [''],
    year                        : [moment()],
    make                        : ['', [Validators.required]],
    model                       : [''],
    title                       : [''],
    license                     : [''],
    registration                : [''],
    insurance_status            : [''],
    liability                   : [''],
    collision                   : [''],
    comprehensive               : [''],
    purchase_price              : [''],
    date_of_purchase            : [''],
    sales_price                 : [''],
    date_of_sales               : [''],
    estimated_market_value      : [''],
    source_of_market_value      : [''],
    date_of_market_value        : [''],
    pictures                    : ['']
     
  });
  if (this.data) {
    const { motorizedObj } = this.data;
    this.form.patchValue({

    id                        : this.data.motorizedData.id,
    type                      : this.data.motorizedData.type,
    status                    : this.data.motorizedData.status.toString(),
    name                      : this.data.motorizedData.name,
    license_plate             : this.data.motorizedData.license_plate,
    vin_number                : this.data.motorizedData.vin_number,
    odometer                  : this.data.motorizedData.odometer,
    odometer_reading          : this.data.motorizedData.odometer_reading,
    company_id                : this.data.motorizedData.company_id,
    color                     : this.data.motorizedData.color,
    year                      : this.data.motorizedData.year,
    make                      : this.data.motorizedData.make,
    model                     : this.data.motorizedData.model,
    title                     : this.data.motorizedData.title,
    license                   : this.data.motorizedData.license,
    registration              : this.data.motorizedData.registration,
    insurance_status          : this.data.motorizedData.insurance_status,
    liability                 : this.data.motorizedData.liability,
    collision                 : this.data.motorizedData.collision,
    comprehensive             : this.data.motorizedData.comprehensive,
    purchase_price            : this.data.motorizedData.purchase_price,
    date_of_purchase          : this.data.motorizedData.date_of_purchase,
    sales_price               : this.data.motorizedData.sales_price,
    date_of_sales             : this.data.motorizedData.date_of_sales,
    estimated_market_value    : this.data.motorizedData.estimated_market_value,
    source_of_market_value    : this.data.motorizedData.source_of_market_value,
    date_of_market_value      : this.data.motorizedData.date_of_market_value,
    pictures                  : this.data.motorizedData.pictures,
    });
}
  
}


onSubmit(): void {
    this._motorizedService.isLoadingMotorizedVehicle.next(true);
    if (this.data) {
        this._motorizedService.updateMotorized(this.form.value);
    } else {
        this._motorizedService.createMotorized(this.form.value);
    }
}

discard(): void {
    this._motorizedService.isLoadingMotorizedVehicle.next(false);
    this.matDialogRef.close();
}

//#region Init Calendar
initCalendar() {
  //Calender Year Initilize
  if (this.data) {
      this.year = new FormControl(this.data.motorizedData.year);

  } else {
      this.year = new FormControl(moment());
  }
}
//#endregion

//#region Calendar Year Function
chosenYearHandler(
  normalizedYear: Moment,
  datepicker: MatDatepicker<Moment>
) {
  const ctrlValue = moment(this.year.value);
  ctrlValue.year(normalizedYear.year());
  this.year.setValue(ctrlValue);
  console.log(this.year.value);
  console.log(ctrlValue);

  this.form.value.year = ctrlValue;
  datepicker.close();
}

//#endregion


}
  