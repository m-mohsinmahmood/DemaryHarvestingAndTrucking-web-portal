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
    this.matDialogRef.close({ 
      data: {
      rate_type : this.form.value.rate_type,
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
    rate_type      : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)]],
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
