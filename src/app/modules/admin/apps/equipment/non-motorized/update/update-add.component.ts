
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import moment from 'moment';
import { NonMotorized } from '../non-motorized.types';
import { NonMotorizedService } from '../non-motorized.service';

@Component({
  selector: 'app-updateadd',
  templateUrl: './update-add.component.html',
  styleUrls: ['./update-add.component.scss']
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
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
   ) {
    
    }

  ngOnInit(): void {
    this.initForm();
    console.log(this.data);
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
    type: [''],
    status: [''],
    name: [''],
    license_plate: [''],
    vin_number: [''],
    company_id: [''],
    color: [''],
    year: [''],
    make: [''],
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
    date_of_market_value: ['']
     
  });
  if (this.data) {
    this.form.patchValue({

    id: this.data.nonMotorizedData.id,
    type: this.data.nonMotorizedData.type,
    status: this.data.nonMotorizedData.status.toString(),
    name: this.data.nonMotorizedData.name,
    license_plate: this.data.nonMotorizedData.license_plate,
    vin_number: this.data.nonMotorizedData.vin_number,
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
    date_of_market_value: this.data.nonMotorizedData.date_of_market_value
       
    });
}
  
}



onSubmit(): void {
  console.log("form", this.form.value)
    this._nonMotorizedService.isLoadingNonMotorizedVehicle.next(true);
    if (this.data) {
        this._nonMotorizedService.updateNonMotorized(this.form.value);
    } else {
        this._nonMotorizedService.createNonMotorized(this.form.value);
    }
}

discard(): void {
    this._nonMotorizedService.isLoadingNonMotorizedVehicle.next(false);
    this.matDialogRef.close();
}




}
  