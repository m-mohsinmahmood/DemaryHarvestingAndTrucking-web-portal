import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../../customers.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-add-hauling-rate',
  templateUrl: './add-hauling-rate.component.html',
  styleUrls: ['./add-hauling-rate.component.scss']
})
export class AddHaulingRateComponent implements OnInit {

  //#region  Local Variables
  form: FormGroup;
  formValid: boolean;
  rateTypes = ['Bushels', 'Hundred Weight', 'Miles', 'Tons', 'Ton Miles', 'Bushels + Excess Yield', 'Load Count'];

  //#endregion

  //#region Observables
  closeDialog$: Observable<boolean>;
  isLoadingHaulingRate$: Observable<boolean>;
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
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddHaulingRateComponent>,
    public _customerService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  //#region Lifecycle Functions
  ngOnInit(): void {
    this.initObservables();
    this.initForm();
    this.farmSearchSubscription();
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
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region Init Observables 
  initObservables() {
    this.isLoadingHaulingRate$ = this._customerService.isLoadingHaulingRate$
  }
  //#endregion

  //#region Form
  initForm(): void {
    this.form = this._formBuilder.group({
      id: [''],
      customer_id: this.data.customer_id,
      farm_id: ['', [Validators.required]],
      crop_id: ['', [Validators.required]],
      rate_type: ['', [Validators.required]],
      rate: [''],
      base_rate: [''],
      premium_rate: [''],
      base_bushels: [''],
    });
    if (this.data && this.data.isEdit) {
      const { customer_id, haulingRate } = this.data;
      this.form.patchValue({
        customer_id: customer_id,
        id: haulingRate.id,
        farm_id: { farm_id: haulingRate.farm_id, name: haulingRate.farm_name },
        crop_id: { crop_id: haulingRate.crop_id, name: haulingRate.crop_name },
        rate_type: haulingRate.rate_type.toString(),
        rate: haulingRate.rate,
        base_rate: haulingRate.base_rate,
        base_bushels: haulingRate.base_bushels,
        premium_rate: haulingRate.premium_rate,
      });
    }
  }

  onSubmit(): void {
    this._customerService.isLoadingHaulingRate.next(true);
    this.form.value['crop_id'] = this.form.value['crop_id']?.crop_id;
    this.form.value['farm_id'] = this.form.value['farm_id']?.id;
    if (this.data && this.data.isEdit) {
      this.form.value['farm_id'] = this.form.value['farm_id']?.farm_id;
      if (this.form.value.rate_type != 'Ton Miles' && this.form.value.rate_type != 'Bushels + Excess Yield') {
        this.form.value.base_rate = 0;
        this.form.value.premium_rate = 0;
        this.form.value.base_bushels = 0;
      }
      if (this.form.value.rate_type == 'Ton Miles' || this.form.value.rate_type == 'Bushels + Excess Yield') {
        this.form.value.rate = 0;
      }
      this._customerService.updateHaulingRate(this.form.value);
    } else {
      this._customerService.createHaulingRate(this.form.value);
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

  discard(): void {
    this._customerService.isLoadingHaulingRate.next(false);
    this.matDialogRef.close();
  }
  //#endregion

  //#region Validation
  formValidation(e) {
    typeof (e) == 'string' ? (this.formValid = true) : (this.formValid = false)
  }
  //#endregion

}
