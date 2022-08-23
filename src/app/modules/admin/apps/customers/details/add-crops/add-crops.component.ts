import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-crops',
  templateUrl: './add-crops.component.html',
  styleUrls: ['./add-crops.component.scss']
})
export class AddCropsComponent implements OnInit {
  public form: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<AddCropsComponent>,
    private _formBuilder: FormBuilder,
    
    ) { }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      cropsItemRows: this._formBuilder.array([this.initCropItemRows()]),
  
      
  });
  }

  get cropArr() {
    return this.form.get('cropsItemRows') as FormArray;
  }

  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }

  initCropItemRows() {
    return this._formBuilder.group({
      cropid: [''],
      cropHarvestYear: [''],
      cropCrop: [''],
      cropPoundsPerBushel: [''],
    });
  }

  addNewCropRow() {
    this.cropArr.push(this.initCropItemRows());
  }

  deleteCropRow(index: number) {
    this.cropArr.removeAt(index);
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
      console.log(this.form.controls);
      // this.api.createProduct(this.form.value)
      // .subscribe({
      //   next:(res)=>{
      //     alert("Customer Added Successfully1") 
      //     this.form.reset();
      //     this.matDialogRef.close('save');
      //   },
      //   error:()=>{
      //     alert("Error!")
      //   }
      // }

      // )


    }

}
