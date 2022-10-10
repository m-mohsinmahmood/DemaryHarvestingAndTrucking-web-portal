/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/member-ordering */
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCustomer implements OnInit {
    public form: FormGroup;
    private _customersService: any;
    selectedProduct: any;
    private _changeDetectorRef: any;
    constructor(
        public matDialogRef: MatDialogRef<AddCustomer>,
        private _formBuilder: FormBuilder,
        private api: CustomersService
    ) {}

    ngOnInit(): void {
        // Create the form
        this.form = this._formBuilder.group({
          id: [''],
          customer_name:[''],
          company_name:[''],
          main_contact: [''],
          phone_number:[''],
          state: [''],
          country: [''],
          email: [''],
          fax: [''],
          customer_type: [''],
          status: [''],
          address: [''],
          billing_address: [''],
          city: [''],
          zip_code: [''],
          company_position: [''],
          commercialTrucking: [''],
          website: [''],
          linkedin: [''],
        });
    }

    

    onSubmit(): void {
        console.warn('Your order has been submitted', this.form.value);
        this.form.reset();
    }


    /**
     * Save and close
     */
    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {
        this.matDialogRef.close();
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {}

    createProduct(): void {
        // Create the product
        this._customersService.createProduct().subscribe((newProduct) => {
            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            this.form.patchValue(this.form.value);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Send the message
     */
    send(): void {
        console.log(this.form.controls);
        this.api.createCustomer(this.form.value)
        // .subscribe({
        //     next: (res) => {
        //         alert('Customer Added Successfully1');
        //         this.form.reset();
        //         this.matDialogRef.close('save');
        //     },
        //     error: () => {
        //         alert('Error!');
        //     },
        // });
    }
}
