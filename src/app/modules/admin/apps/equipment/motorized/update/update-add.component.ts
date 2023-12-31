
import { ChangeDetectorRef, Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
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
  pictures1Preview: string = '';
  pictures2Preview: string = '';
  pictures3Preview: string = '';

  //#region Observables
  motorized$: Observable<Motorized>;
  isLoadingMotorizedVehicle$: Observable<boolean>;
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
    this.initObservables()


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
      id: [''],
      type: ['', [Validators.required]],
      status: true,
      name: ['', [Validators.required]],
      license_plate: [''],
      vin_number: [''],
      odometer_reading_start: [''],
      odometer_reading_end: [''],
      company_id: ['', [Validators.required]],
      truck_id: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      color: [''],
      year: [moment()],
      make: ['', [Validators.required]],
      model: [''],
      title: [''],
      license: [''],
      registration: [''],
      insurance_status: [''],
      liability: [''],
      collision: [''],
      comprehensive: [''],
      purchase_price: [''],
      date_of_purchase: [''],
      sales_price: [''],
      date_of_sales: [''],
      estimated_market_value: [''],
      source_of_market_value: [''],
      date_of_market_value: [''],
      pictures1: [''],
      pictures2: [''],
      pictures3: ['']

    });
    if (this.data) {
      const { motorizedObj } = this.data;
      this.form.patchValue({

        id: this.data.motorizedData.id,
        type: this.data.motorizedData.type,
        status: this.data.motorizedData.status.toString(),
        name: this.data.motorizedData.name,
        license_plate: this.data.motorizedData.license_plate,
        vin_number: this.data.motorizedData.vin_number,
        odometer_reading_start: this.data.motorizedData.odometer_reading_start,
        odometer_reading_end: this.data.motorizedData.odometer_reading_end,
        company_id: this.data.motorizedData.company_id,
        truck_id: this.data.motorizedData.truck_id,
        company_name: this.data.motorizedData.company_name,
        color: this.data.motorizedData.color,
        year: this.data.motorizedData.year,
        make: this.data.motorizedData.make,
        model: this.data.motorizedData.model,
        title: this.data.motorizedData.title,
        license: this.data.motorizedData.license,
        registration: this.data.motorizedData.registration,
        insurance_status: this.data.motorizedData.insurance_status,
        liability: this.data.motorizedData.liability,
        collision: this.data.motorizedData.collision,
        comprehensive: this.data.motorizedData.comprehensive,
        purchase_price: this.data.motorizedData.purchase_price,
        date_of_purchase: this.data.motorizedData.date_of_purchase,
        sales_price: this.data.motorizedData.sales_price,
        date_of_sales: this.data.motorizedData.date_of_sales,
        estimated_market_value: this.data.motorizedData.estimated_market_value,
        source_of_market_value: this.data.motorizedData.source_of_market_value,
        date_of_market_value: this.data.motorizedData.date_of_market_value,
        pictures: this.data.motorizedData.pictures,
      });
    }

  }
  //#region Init Observables
  initObservables() {
    this.isLoadingMotorizedVehicle$ = this._motorizedService.isLoadingMotorizedVehicle$;
    this.closeDialog$ = this._motorizedService.closeDialog$;
  }
  //#endregion


  onSubmit(): void {
    this._motorizedService.isLoadingMotorizedVehicle.next(true);
    if (this.data) {
      this._motorizedService.updateMotorized(this.form.value);
    } else {
      var formData: FormData = new FormData();
      formData.append('form', JSON.stringify(this.form.value));
      formData.append('image', this.form.get('pictures1').value);
      formData.append('image', this.form.get('pictures2').value);
      formData.append('image', this.form.get('pictures3').value);
      this._motorizedService.createMotorized(formData);
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
  //#region Upload Image
  uploadImage(event: any, picture) {
    if (
        event.target.files &&
        event.target.files[0] &&
        event.target.files[0].type.includes('image/')
    ) {
        const reader = new FileReader();
        if (picture === 'pictures1') {
            reader.onload = (_event: any) => {
                this.pictures1Preview = event.target.files[0].name
                this.form.controls['pictures1']?.setValue(event.target.files[0]);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else  if (picture === 'pictures2') {
            reader.onload = (_event: any) => {
                this.pictures2Preview = event.target.files[0].name
                this.form.controls['pictures2']?.setValue(event.target.files[0]);
            };
            reader.readAsDataURL(event.target.files[0]);
        } else  if (picture === 'pictures3') {
            reader.onload = (_event: any) => {
                this.pictures3Preview = event.target.files[0].name

                this.form.controls['pictures3']?.setValue(event.target.files[0]);
            };
            reader.readAsDataURL(event.target.files[0]);
        }

    } else {
        this.form.controls[picture].setErrors({'incorrect': true});

    }
}
//#endregion

}
