import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-farms',
  templateUrl: './add-farms.component.html',
  styleUrls: ['./add-farms.component.scss']
})
export class AddFarmsComponent implements OnInit {

  public form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddFarmsComponent>,
    private _formBuilder: FormBuilder,
    
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      farmItemRows: this._formBuilder.array([this.initFarmItemRows()]),
  
      
  });
  
  }

  get formArr() {
    return this.form.get('farmItemRows') as FormArray;
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

  addNewFarmRow() {
    this.formArr.push(this.initFarmItemRows());
  }

  deleteFarmRow(index: number) {
    this.formArr.removeAt(index);
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
