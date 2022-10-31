import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-add-custom-farming-rate',
  templateUrl: './add-custom-farming-rate.component.html',
  styleUrls: ['./add-custom-farming-rate.component.scss']
})
export class AddCustomFarmingRateComponent implements OnInit {

  //#region  Local Variables
  form: FormGroup;
  equipmentTypes = ['Ripper','Offset Disking','Drilling','Offset Disking & Crumbler','Listing','Tiger',"Swathing - 35 Draper","Swathing - 15 Draper"];
  //#endregion

  //#region Observables
  closeDialog$: Observable<boolean>;
  isLoadingFarmingRate$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddCustomFarmingRateComponent>,
    public _customerService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  //#region Lifecycle Functions
  ngOnInit(): void {
    this.initObservables();
    this.initForm();
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
    this.isLoadingFarmingRate$ = this._customerService.isLoadingFarmingRate$
  }
  //#endregion

  //#region Form
  initForm(): void {
    this.form = this._formBuilder.group({
      id: [''],
      customer_id: this.data.customerId,
      equipment_type: [''],
      rate: [''],
    });
    if (this.data && this.data.isEdit) {
      const { customerId , farmingRate } = this.data;
      this.form.patchValue({
        customer_id: customerId,
        id: farmingRate.id,
        equipment_type: farmingRate.equipment_type.toString(),
        rate: farmingRate.rate,
      });
    }
  }
  onSubmit(): void {
    this._customerService.isLoadingFarmingRate.next(true);
    if (this.data && this.data.isEdit) {
      this._customerService.updateFarmingRate(this.form.value);
    } else {
      this._customerService.createFarmingRate(this.form.value);
    }
  }

  discard(): void {
    this._customerService.isLoadingFarmingRate.next(false);
    this.matDialogRef.close();
  }
  //#endregion

}
