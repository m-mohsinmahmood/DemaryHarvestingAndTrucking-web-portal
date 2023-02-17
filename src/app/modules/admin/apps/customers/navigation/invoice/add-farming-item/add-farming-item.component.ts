import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-farming-item',
  templateUrl: './add-farming-item.component.html',
  styleUrls: ['./add-farming-item.component.scss']
})
export class AddFarmingItemComponent implements OnInit {

  public form: FormGroup;
  equipmentTypes = ['Ripper','Offset Disking','Drilling','Offset Disking & Crumbler','Listing','Tiger',"Swathing - 35 Draper","Swathing - 15 Draper"];
  qty_types = ['Acres', 'Hours', 'Flat'];
  
  isLoadingCustomFarmingInvoiceList$: Observable <any>
  closeDialog$: Observable<boolean>;
  
  constructor(
    public matDialogRef: MatDialogRef<AddFarmingItemComponent  >,
    private _formBuilder: FormBuilder,
    private api: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customersService: CustomersService,


    ) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  // Create the form
  

this._customersService.closeDialog$.subscribe((res) => {
  if (res) {
      this.matDialogRef.close();
      this._customersService.closeDialog.next(false);
  }
});
  }

 //#region Init Observables 
 initObservables() {
  this.isLoadingCustomFarmingInvoiceList$ = this._customersService.isLoadingCustomerDestination$
  this.closeDialog$ = this._customersService.closeDialog$;
}
//#endregion

  onSubmit(): void {
    this._customersService.isLoadingCustomFarmingInvoiceList.next(true);

    if (this.data && this.data.isEdit) {
      this._customersService.updateFarmingInvoice(this.form.value);

    } else {
      this._customersService.createFarmingInvoice(this.form.value);
    }
    console.log(this.form.value);
  }


   //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      date    : [''],
      equipment_type         : [''],
      quantity_type        :[''],
      quantity      : [''],
      amount :[''],
      rate:[''],
      customer_id: this.data.customer_id,


  
  });
    if (this.data && this.data.isEdit) {
      const { invoiceData, customer_id } = this.data;
      this.form.patchValue({
        customer_id: customer_id,
        id: invoiceData.id,
        date: invoiceData.date,
        equipment_type: invoiceData.equipment_type,
        quantity_type: invoiceData.quantity_type,
        quantity: invoiceData.quantity,
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
