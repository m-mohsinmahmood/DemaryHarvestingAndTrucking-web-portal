import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-trucking-item',
  templateUrl: './add-trucking-item.component.html',
  styleUrls: ['./add-trucking-item.component.scss']
})
export class AddTruckingItemComponent implements OnInit {

  public form: FormGroup;
  rateTypes = ['Bushels', 'Flat', 'Hours', 'Hundred Weight', 'Loaded Miles', 'Pounds', 'Tons'];

  isLoadingCustomTruckingInvoiceList$: Observable<any>
  closeDialog$: Observable<boolean>;

  constructor(
    public matDialogRef: MatDialogRef<AddTruckingItemComponent>,
    private _formBuilder: FormBuilder,
    private api: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customersService: CustomersService,


  ) { }

  ngOnInit(): void {

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
  this.isLoadingCustomTruckingInvoiceList$ = this._customersService.isLoadingCustomTruckingInvoiceList$
  this.closeDialog$ = this._customersService.closeDialog$;
}
//#endregion

  onSubmit(): void {
    this._customersService.isLoadingCustomFarmingInvoiceList.next(true);

    if (this.data && this.data.isEdit) {
      this._customersService.updateTruckingInvoice(this.form.value);

    } else {
      this._customersService.createTruckingInvoice(this.form.value);
    }
    console.log(this.form.value);
  }

  
//#region Form
initForm() {
  // Create the form
  this.form = this._formBuilder.group({
    id:[''],
    date: [''],
      billing_id: [''],
      cargo: [''],
      city: [''],
      state: [''],
      rate_type: [''],
      rate: [''],
      amount: [''],
    customer_id: this.data.customer_id,



});
  if (this.data && this.data.isEdit) {
    const { invoiceData, customer_id } = this.data;
    this.form.patchValue({
      customer_id: customer_id,
      id: invoiceData.id,
      date: invoiceData.date,
      billing_id: invoiceData.billing_id,
      cargo: invoiceData.cargo,
      city: invoiceData.city,
      state: invoiceData.state,
      rate_type: invoiceData.rate_type,
      rate: invoiceData.rate,
      amount: invoiceData.amount
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
