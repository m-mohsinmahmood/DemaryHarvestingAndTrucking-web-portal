import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CropService } from 'app/modules/admin/apps/crops/crops.services';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { CustomersService } from '../../../../customers.service';

@Component({
  selector: 'app-add-combining-rate',
  templateUrl: './add-combining-rate.component.html',
  styleUrls: ['./add-combining-rate.component.scss']
})
export class AddCombiningRateComponent implements OnInit {

  //#region Observables
    isLoadingCombiningRate$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
  //#endregion

  //#region Variables
    form: FormGroup;
    routeID: string;
    imageURL: string = '';
    formValid: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  //#region Auto Complete Farms
  allFarms: Observable<any>;
  farm_search$ = new Subject();
  //#endregion
  
  //#region Auto Complete Crops
    allCrops: Observable<any>;
    crop_search$ = new Subject();
  //#endregion

  constructor(
    private matDialogRef: MatDialogRef<AddCombiningRateComponent>,
    private _formBuilder: FormBuilder,
    private _customerService: CustomersService,
    public _cropService: CropService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  
   }

  //#region Lifecycle Function
    ngOnInit(): void {
      this.initObservables();
      this.initForm();
      this.farmSearchSubscription();
      this.cropSearchSubscription();
      this._customerService.closeDialog$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((res) => {
          if (res) {
              this.matDialogRef.close();
              this._customerService.closeDialog.next(false);
          }
      });
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
  //#endregion

  //#region Init Observables 
    initObservables(){
      this.isLoadingCombiningRate$ = this._customerService.isLoadingCombiningRate$      
      this.closeDialog$ = this._customerService.closeDialog$;

      this.isLoadingCombiningRate$ = this._customerService.isLoadingCombiningRate$      
      this.closeDialog$ = this._customerService.closeDialog$;
    }
  //#endregion

  //#region Form
    initForm(){
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: this.data.customer_id,
            farm_id: ['', [Validators.required]],
            crop_id: ['', [Validators.required]],
            combining_rate: ['',[Validators.required]],
            base_bushels: [],
            premium_rate: [],
        });
        if (this.data && this.data.isEdit) {
          const { combiningRate, customer_id } = this.data;
          this.form.patchValue({
            id: combiningRate.id,
            customer_id: customer_id,
            farm_id: {farm_id: combiningRate.farm_id, name: combiningRate.farm_name},
            crop_id: {crop_id: combiningRate.crop_id, name: combiningRate.crop_name},
            combining_rate: combiningRate.combining_rate,
            base_bushels: combiningRate.base_bushels,
            premium_rate: combiningRate.premium_rate,
          });
      }
    }
  
    onSubmit(): void {
      this._customerService.isLoadingCombiningRate.next(true);
      this.form.value['crop_id'] = this.form.value['crop_id']?.crop_id;
      this.form.value['farm_id'] = this.form.value['farm_id']?.id;
      if (this.data && this.data.isEdit) {
          this.form.value['farm_id'] = this.form.value['farm_id']?.farm_id;
          this._customerService.updateCombiningRate(this.form.value);
      } else {
          this._customerService.createCombiningRate(this.form.value);
      }
    }

    getDropdownCustomerFarms() {
      let value;
      typeof this.form.controls['farm_id'].value  === 'object' ? (value = this.form.controls['farm_id'].value.farm_name) : (value = this.form.controls['farm_id'].value);
      this.allFarms = this._customerService.getDropdownCustomerFarms(this.data.customer_id, value);
    }

    getDropdownCustomerCrops() {
      let value;
      typeof this.form.controls['crop_id'].value  === 'object' ? (value = this.form.controls['crop_id'].value.crop_name) : (value = this.form.controls['crop_id'].value);
      this.allCrops = this._customerService.getDropdownCustomerCrops(this.data.customer_id, value, "customerRates");
    }

    discard(): void {
      this._customerService.isLoadingCombiningRate.next(false);
      this.matDialogRef.close();
    }
  //#endregion

  //#region Auto Complete Farms Display Function
  displayFarmForAutoComplete(farm: any) {
    return farm ? `${farm.name}` : undefined;
  }
  //#endregion

  //#region Auto Complete Crops Display Function
    displayCropForAutoComplete(crop: any) {
      return crop ? `${crop.name}` : undefined;
    }
  //#endregion

  //#region Farm Search Function
   farmSearchSubscription() {
    this.farm_search$
        .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this._unsubscribeAll)
        )
        .subscribe((value: string) => {
            this.allFarms = this._customerService.getDropdownCustomerFarms(
              this.data.customer_id,
                value
            );
        });
  }
  //#endregion

  //#region Crop Search Function
  cropSearchSubscription() {
    this.crop_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allCrops = this._customerService.getDropdownCustomerCrops(
          this.data.customer_id,
          value,
          "customerRates"
        );
      });
  }
//#endregion

//#region Validation
formValidation(e){
  typeof(e) == 'string' ? (this.formValid = true) : (this.formValid = false)
}
//#endregion

}
