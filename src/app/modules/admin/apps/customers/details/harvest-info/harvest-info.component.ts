import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-harvest-info',
  templateUrl: './harvest-info.component.html',
  styleUrls: ['./harvest-info.component.scss']
})
export class HarvestInfoComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<HarvestInfoComponent>,
    private _formBuilder: FormBuilder,
    
  ) { }

  public form: FormGroup;

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      harvestYear         : [''],
      skipInvoiceMath1              : [''],
      arizonaInvoiceMath          : [''],
      skipInvoiceMath2            : [''],
      isActive            : [''],
  
      
  });
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
