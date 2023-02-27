import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss']
})
export class AddDetailsComponent implements OnInit {

  public form: FormGroup;
  rateTypes = ['Bushels', 'Flat', 'Hours', 'Hundred Weight', 'Loaded Miles', 'Pounds', 'Tons'];

  isLoadingCustomRentalInvoiceList$: Observable<any>
  closeDialog$: Observable<boolean>;

  constructor(
    public matDialogRef: MatDialogRef<AddDetailsComponent>,
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
    this.matDialogRef.close({
        data: {
            date: this.form.value.date,
            invoice_no: this.form.value.invoice_no,
            details: this.form.value.details,
            notes: this.form.value.notes,
            terms: this.form.value.terms,
            deliver_in: this.form.value.deliver_in
        }
      })
  }


//#region Form
initForm() {
  // Create the form
  this.form = this._formBuilder.group({
    id:[''],
    date: [''],
    invoice_no:[''],
    details:[''],
    notes:[''],
    terms:[''],
    deliver_in:[''],



});
  if (this.data && this.data.isEdit) {
    const { invoiceData, customer_id } = this.data;
    this.form.patchValue({
      id: invoiceData.id,
      date: invoiceData.date,
      invoice_no: invoiceData.invoice_no,
      details: invoiceData.details,
      notes: invoiceData.notes,
      terms: invoiceData.terms,
      deliver_in: invoiceData.deliver_in
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
