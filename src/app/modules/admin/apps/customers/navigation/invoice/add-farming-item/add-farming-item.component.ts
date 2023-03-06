import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { alternatives } from 'joi';
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
    this.matDialogRef.close({ 
      data: {
      description : this.form.value.description,
      amount: this.form.value.amount,
      rate:this.form.value.rate,
      quantity:this.form.value.quantity
      }
    })
  }


   //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      description: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      amount :[''],
      rate:[''],
      quantity:[''],
      customer_id: this.data.customer_id,


  
  });
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
