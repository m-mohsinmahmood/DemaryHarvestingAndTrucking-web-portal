import { CustomersService } from './../customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators,FormArray ,FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateComponent implements OnInit {

  form: FormGroup;
  customers:any;

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
    private _formBuilder: FormBuilder,
    public _customerService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
   ) {

    }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id               : [''],
      harvestYear         : [''],
      name             : ['', [Validators.required]],
      alternateName      : [''],
      skipInvoiceMath1              : [''],
      arizonaInvoiceMath          : [''],
      skipInvoiceMath2            : [''],
      email           : [''],
      stateProvince           : [''],
      isActive            : [''],
      title:[''],
      type:[''],
      descripition:[''],
      farmItemRows: this._formBuilder.array([this.initFarmItemRows()]),
      cropsItemRows: this._formBuilder.array([this.initCropItemRows()]),
  
      
  });

   // Get the employee by id
   this._customerService.getProductById(this.data.id).subscribe((customer) => {
    console.log('UPDATE::',customer);
    this.customers = customer;
    this.form.patchValue(customer);
    /*this.form.patchValue({
      farmId: this.customers.farmId,
      farmHarvestYear: this.customers.farmHarvestYear,
      farmName: this.customers.farmName,
      farmTotalAcres: this.customers.farmTotalAcres,
  });*/

});

  }

  get formArr() {
    return this.form.get('farmItemRows') as FormArray;
  }

  get cropArr() {
    return this.form.get('cropsItemRows') as FormArray;
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
      cropid: [''],
      cropHarvestYear: [''],
      cropCrop: [''],
      cropPoundsPerBushel: [''],
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
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }
  
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
