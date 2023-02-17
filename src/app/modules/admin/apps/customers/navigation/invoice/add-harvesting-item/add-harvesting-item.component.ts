import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-harvesting-item',
  templateUrl: './add-harvesting-item.component.html',
  styleUrls: ['./add-harvesting-item.component.scss']
})
export class AddHarvestingItemComponent implements OnInit {

  public form: FormGroup;
  rateTypes = ['Bushels', 'Hundred Weight', 'Miles', 'Tons', 'Ton Miles'];
  //#region Auto Complete Farms
  allFarms: Observable<any>;
  farm_search$ = new Subject();
  formValid: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  isLoadingCustomHarvestingInvoice$: Observable <any>
    closeDialog$: Observable<boolean>;


  //#endregion

  constructor(
    public matDialogRef: MatDialogRef<AddHarvestingItemComponent>,
    private _formBuilder: FormBuilder,
    private _customersService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: CustomersService,

  ) { }

  ngOnInit(): void {
    this.farmSearchSubscription();
    this.initForm();
    this.initObservables();


     this._customersService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customersService.closeDialog.next(false);
            }
        });

  }

   //#region Init Observables 
   initObservables() {
    this.isLoadingCustomHarvestingInvoice$ = this._customersService.isLoadingCustomerDestination$
    this.closeDialog$ = this._customersService.closeDialog$;
}
//#endregion

  onSubmit(): void {
    this._customersService.isLoadingCustomHarvestingInvoice.next(true);
    this.form.value['farm_id'] = this.form.value['farm_id']?.id;

    if (this.data && this.data.isEdit) {
      this._customersService.updateHarvestingInvoice(this.form.value);

    } else {
      this._customersService.createHarvestingInvoice(this.form.value);
    }
    console.log(this.form.value);
  }

  getDropdownFarms() {
    let value;
    typeof this.form.controls['farm_id'].value === 'object' ? (value = this.form.controls['farm_id'].value.name) : value = this.form.controls['farm_id'].value;
    this.allFarms = this._customersService.getDropdownCustomerFarms(this.data.customer_id, value);
  }

  //#region Auto Complete Farms Display Function
  displayFarmForAutoComplete(farm: any) {
    return farm ? `${farm.name}` : undefined;
  }
  //#endregion

  //#region Validation
  formValidation(e) {
    typeof (e) == 'string' ? (this.formValid = true) : (this.formValid = false)
  }
  //#endregion

  //#region  Search Function
  farmSearchSubscription() {
    this.farm_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allFarms = this._customersService.getDropdownCustomerFarms(
          this.data.customer_id,
          value
        );
      });
  }
  //#endregion

  //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      farm_id: [''],
      customer_id: this.data.customer_id,
      service_type: [''],
      farm: [''],
      crop: [''],
      qty_type: [''],
      qty: [''],
      amount: [''],
      rate: [''],
    });

    if (this.data && this.data.isEdit) {
      const { invoiceData, customer_id } = this.data;
      this.form.patchValue({
        customer_id: customer_id,
        id: invoiceData.id,
        farm_id: { id: invoiceData.farm_id, name: invoiceData.farm_name },
        service_type: invoiceData.service_type,
        farm: invoiceData.farm,
        crop: invoiceData.crop_name,
        qty_type: invoiceData.quantity_type,
        qty: invoiceData.quantity,
        amount: invoiceData.amount,
        rate: invoiceData.rate
      });


    }
  }
 
 
  discard(): void {
    this.matDialogRef.close();


  }

  saveAndClose(): void
  {

      // Close the dialog
      this.matDialogRef.close();
  }

  
}
