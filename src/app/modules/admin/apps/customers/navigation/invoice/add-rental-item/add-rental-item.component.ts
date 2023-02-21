import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-rental-item',
  templateUrl: './add-rental-item.component.html',
  styleUrls: ['./add-rental-item.component.scss']
})
export class AddRentalItemComponent implements OnInit {

  public form: FormGroup;
  rateTypes = ['Bushels', 'Flat', 'Hours', 'Hundred Weight', 'Loaded Miles', 'Pounds', 'Tons'];

  isLoadingCustomRentalInvoiceList$: Observable<any>
  closeDialog$: Observable<boolean>;

  constructor(
    public matDialogRef: MatDialogRef<AddRentalItemComponent>,
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
  this.isLoadingCustomRentalInvoiceList$ = this._customersService.isLoadingCustomRentalInvoiceList$
  this.closeDialog$ = this._customersService.closeDialog$;
}
//#endregion

  onSubmit(): void {
    this._customersService.isLoadingCustomRentalInvoiceList.next(true);

    if (this.data && this.data.isEdit) {
      this._customersService.updateRentalInvoice(this.form.value);

    } else {
      this._customersService.createRentalInvoice(this.form.value);
    }
    console.log(this.form.value);
  }

  
//#region Form
initForm() {
  // Create the form
  this.form = this._formBuilder.group({
    id:[''],
    date: [''],
    rental_type:[''],
    quantity_type:[''],
    quantity:[''],
    rate:[''],
    amount:[''],
    customer_id: this.data.customer_id,



});
  if (this.data && this.data.isEdit) {
    const { invoiceData, customer_id } = this.data;
    this.form.patchValue({
      customer_id: customer_id,
      id: invoiceData.id,
      date: invoiceData.date,
      rental_type: invoiceData.rental_type,
      quantity_type: invoiceData.quantity_type,
      quantity: invoiceData.quantity,
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
