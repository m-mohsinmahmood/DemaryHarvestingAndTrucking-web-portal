import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCustomer implements OnInit {

  public form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddCustomer>,
    private _formBuilder: FormBuilder,
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.form = this._formBuilder.group({
    id               : [''],
    harvestYear         : [''],
    name             : ['', [Validators.required]],
    alternateName      : [''],
    skipInvoiceMath1              : [''],
    arizonaInvoiceMath          : [''],
    skipInvoiceMath2            : [''],
    email           : [''],
    isActive            : [''],
  	title:[''],
  	type:[''],
  	descripition:[''],
    farmItemRows: this._formBuilder.array([this.initFarmItemRows()]),
    cropsItemRows: this._formBuilder.array([this.initCropItemRows()]),

    
});
  }

  get formArr() {
    return this.form.get('farmItemRows') as FormArray;
  }

  get cropArr() {
    return this.form.get('cropsItemRows') as FormArray;
  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }

  initFarmItemRows() {
    return this._formBuilder.group({
    farmId:[''],
    farmHarvestYear:[''],
    farmName:[''],
    farmTotalAcres:[''],
    });
  }
  initCropItemRows() {
    return this._formBuilder.group({
    farmId2:[''],
    farmHarvestYear2:[''],
    farmName2:[''],
    farmTotalAcres2:[''],
    });
  }
  addNewFarmRow() {
    this.formArr.push(this.initFarmItemRows());
  }

  deleteFarmRow(index: number) {
    this.formArr.removeAt(index);
  }

  addNewCropRow() {
    this.cropArr.push(this.initCropItemRows());
  }

  deleteCropRow(index: number) {
    this.cropArr.removeAt(index);
  }
  
   /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    send(): void
    {

    }

}
