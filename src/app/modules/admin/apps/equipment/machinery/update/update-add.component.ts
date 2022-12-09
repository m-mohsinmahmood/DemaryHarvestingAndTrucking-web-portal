/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-update',
//   templateUrl: './update.component.html',
//   styleUrls: ['./update.component.scss']
// })
// export class UpdateComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable, Subject } from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import moment from 'moment';
import { Machineries } from '../machinery.types';
import { MachineryService } from '../machinery.service';


@Component({
  selector: 'app-updateadd',
  templateUrl: './update-add.component.html',
  styleUrls: ['./update-add.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateAddMachineryComponent implements OnInit {

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
      machinery$: Observable<Machineries>;
      isLoadingMachinery$: Observable<boolean>;
      closeDialog$: Observable<boolean>;
      private _unsubscribeAll: Subject<any> = new Subject<any>();
      //#endregion



  constructor(
    public matDialogRef: MatDialogRef<UpdateAddMachineryComponent>,
    private _formBuilder: FormBuilder,
    public _machineryService: MachineryService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private _changeDetectorRef: ChangeDetectorRef,
    public _router: Router,
    breakpointObserver: BreakpointObserver,
   ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 860px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    this.routeID = data?data.id: '';
    }

  ngOnInit(): void {
    this.initForm();
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
}


onSubmit(): void {
    // this._machineryService.isLoadingMachinery.next(true);
    // if (this.data && this.data.isEdit) {
    //     this.form.value['customer_type'] = this.form.value['customer_type'].join(', ');
    //     this.updateCustomer(this.form.value);
    // } else {
    //     this._machineryService.createMachinery(this.form.value,this.data?.filters);
    // }
}
// updateCustomer(customerData: any): void {
//   this._machineryService.updateMachinery(
//       MachineryData,
//       this.data.paginationData
//   );
// }
// discard(): void {
//     this._machineryService.isLoadingMachinery.next(false);
//     this.matDialogRef.close();
// }

discard()
{
  
}


}
  