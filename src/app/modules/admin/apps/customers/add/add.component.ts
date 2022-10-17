/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/member-ordering */
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Customers } from '../customers.types';
import { boolean } from 'joi';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCustomer implements OnInit {
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    closeDialog$: Observable<boolean>;

    public form: FormGroup;
    selectedProduct: any;
    private _changeDetectorRef: any;
    constructor(
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddCustomer>,
        private _formBuilder: FormBuilder,
        private api: CustomersService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.closeDialog$ = this._customersService.closeDialog$;
        this._customersService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customersService.closeDialog.next(false);
            }
        });

        // Create the form
        this.form = this._formBuilder.group({
            id              : [''],
            customer_name   : [''],
            company_name    : [''],
            main_contact    : [''],
            phone_number    : [''],
            state           : [''],
            country         : [''],
            email           : [''],
            fax             : [''],
            customer_type   : [''],
            status          : true,
            address         : [''],
            billing_address : [''],
            city            : [''],
            zip_code        : [''],
            position        : [''],
            website         : [''],
            linkedin        : [''],
        });

        if (this.data && this.data.isEdit) {
            const { customerData } = this.data;
            this.form.patchValue({
                id                  : customerData.id,
                customer_name       : customerData.customer_name,
                company_name        : customerData.company_name,
                main_contact        : customerData.main_contact,
                phone_number        : customerData.phone_number,
                state               : customerData.state,
                country             : customerData.country,
                email               : customerData.email,
                fax                 : customerData.fax,
                customer_type       : customerData.customer_type.replace(/\s/g, '').split(","),
                status              : customerData.status.toString(),
                address             : customerData.address,
                billing_address     : customerData.billing_address,
                city                : customerData.city,
                zip_code            : customerData.zip_code,
                company_position    : customerData.company_position,
                website             : customerData.website,
                linkedin            : customerData.linkedin,
            });
        }
    }

    initApis() {
        this._customersService.getCustomers();
    }

    createCustomer(customerData: any): void {
        this._customersService.createCustomer(customerData);
    }
    updateCustomer(customerData: any): void {
        this._customersService.updateCustomer(
            customerData,
            this.data.paginationData
        );
    }

    onSubmit(): void {
        this._customersService.isLoadingCustomer.next(true);
        if (this.data && this.data.customerData.isEdit) {
            this.form.value["customer_type"] = this.form.value["customer_type"].join(", ");
            this.updateCustomer(this.form.value);
        } else {
            this.createCustomer(this.form.value);
        }
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

    // createProduct(): void {
    //     // Create the product
    //     this._customersService.createProduct().subscribe((newProduct) => {
    //         // Go to new product
    //         this.selectedProduct = newProduct;

    //         // Fill the form
    //         this.form.patchValue(this.form.value);

    //         // Mark for check
    //         this._changeDetectorRef.markForCheck();
    //     });
    // }

    /**
     * Send the message
     */
    // send(): void {
    //     console.log(this.form.controls);
    //     this.api.createCustomer(this.form.value);
    //     // .subscribe({
    //     //     next: (res) => {
    //     //         alert('Customer Added Successfully1');
    //     //         this.form.reset();
    //     //         this.matDialogRef.close('save');
    //     //     },
    //     //     error: () => {
    //     //         alert('Error!');
    //     //     },
    //     // });
    // }
}
