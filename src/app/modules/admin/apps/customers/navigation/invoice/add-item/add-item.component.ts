import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  public itemForm: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddItemComponent  >,
    private _formBuilder: FormBuilder,
    private api: CustomersService,
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.itemForm = this._formBuilder.group({
    itemListInvoiceModule    : [''],
    qtyInvoiceModule         : [''],
    rateInvoiceModule        :[''],
    amountInvoiceModule      : [''],
    

    
});
  }

  get formArr() {
    return this.itemForm.get('farmItemRows') as FormArray;
  }

  get cropArr() {
    return this.itemForm.get('cropsItemRows') as FormArray;
  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.itemForm.value);
    this.itemForm.reset();
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
      this.matDialogRef.close();


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
      console.log(this.itemForm.controls);
      this.api.createProduct(this.itemForm.value)
      .subscribe({
        next:(res)=>{
          alert("Customer Added Successfully1") 
          this.itemForm.reset();
          this.matDialogRef.close('save');
        },
        error:()=>{
          alert("Error!")
        }
      }

      )


    }
}
