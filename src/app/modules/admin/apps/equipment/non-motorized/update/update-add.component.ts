
import { ChangeDetectorRef, Component, Directive, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment, { Moment } from 'moment';
import { NonMotorized } from '../non-motorized.types';
import { NonMotorizedService } from '../non-motorized.service';
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

export class UpdateAddNonMotorizedComponent implements OnInit {

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
  nonMotorized$: Observable<NonMotorized>;
  isLoadingNonMotorized$: Observable<boolean>;
  closeDialog$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion



  constructor(
    public matDialogRef: MatDialogRef<UpdateAddNonMotorizedComponent>,
    private _formBuilder: FormBuilder,
    public _nonMotorizedService: NonMotorizedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();

    this.initCalendar();

    this._nonMotorizedService.closeDialog$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res) {
          this.matDialogRef.close();
          this._nonMotorizedService.closeDialog.next(false);
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
      this.form.patchValue({

        id: this.data.nonMotorizedData.id,
        type: this.data.nonMotorizedData.type,
        status: this.data.nonMotorizedData.status.toString(),
        name: this.data.nonMotorizedData.name,
        license_plate: this.data.nonMotorizedData.license_plate,
        vin_number: this.data.nonMotorizedData.vin_number,
        odometer_reading_start: this.data.nonMotorizedData.odometer_reading_start,
        odometer_reading_end: this.data.nonMotorizedData.odometer_reading_end,
        company_id: this.data.nonMotorizedData.company_id,
        color: this.data.nonMotorizedData.color,
        year: this.data.nonMotorizedData.year,
        make: this.data.nonMotorizedData.make,
        model: this.data.nonMotorizedData.model,
        title: this.data.nonMotorizedData.title,
        license: this.data.nonMotorizedData.license,
        registration: this.data.nonMotorizedData.registration,
        insurance_status: this.data.nonMotorizedData.insurance_status,
        liability: this.data.nonMotorizedData.liability,
        collision: this.data.nonMotorizedData.collision,
        comprehensive: this.data.nonMotorizedData.comprehensive,
        purchase_price: this.data.nonMotorizedData.purchase_price,
        date_of_purchase: this.data.nonMotorizedData.date_of_purchase,
        sales_price: this.data.nonMotorizedData.sales_price,
        date_of_sales: this.data.nonMotorizedData.date_of_sales,
        estimated_market_value: this.data.nonMotorizedData.estimated_market_value,
        source_of_market_value: this.data.nonMotorizedData.source_of_market_value,
        date_of_market_value: this.data.nonMotorizedData.date_of_market_value,
        pictures: this.data.nonMotorizedData.pictures
      });
    }

  }

  //#region Init Observables
  initObservables() {
    this.isLoadingNonMotorized$ = this._nonMotorizedService.isLoadingNonMotorizedVehicle$;
    this.closeDialog$ = this._nonMotorizedService.closeDialog$;
  }
  //#endregion



  onSubmit(): void {
    this._nonMotorizedService.isLoadingNonMotorizedVehicle.next(true);
    if (this.data) {
      this._nonMotorizedService.updateNonMotorized(this.form.value);
    } else {
        var formData: FormData = new FormData();
        formData.append('form', JSON.stringify(this.form.value));
        formData.append('image', this.form.get('pictures1').value);
        formData.append('image', this.form.get('pictures2').value);
        formData.append('image', this.form.get('pictures3').value);
        this._nonMotorizedService.createNonMotorized(formData);
    }
  }

  discard(): void {
    this._nonMotorizedService.isLoadingNonMotorizedVehicle.next(false);
    this.matDialogRef.close();
  }

  //#region Init Calendar
  initCalendar() {
    //Calender Year Initilize
    if (this.data) {
      this.year = new FormControl(this.data.nonMotorizedData.year);

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
