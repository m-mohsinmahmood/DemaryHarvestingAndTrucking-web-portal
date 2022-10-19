/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/member-ordering */
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Customers } from '../customers.types';
import { boolean } from 'joi';
import { state } from '@angular/animations';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCustomer implements OnInit {

    //#region Observables
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables
    public form: FormGroup;
    selectedProduct: any;
    country_list = ['USA'];
   state_list =['Alaska', 'Alabama', 'Arkansas', 'American Samoa', 'Arizona', 'California', 'Colorado', 'Connecticut', 'District of Columbia', 'Delaware', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Virgin Islands', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming'];
    //#endregion

    // Constructor
    constructor(
        private _customersService: CustomersService,
        public matDialogRef: MatDialogRef<AddCustomer>,
        private _formBuilder: FormBuilder,
        private api: CustomersService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initObservables();
        this.initForm();
        this._customersService.closeDialog$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customersService.closeDialog.next(false);
            }
        });
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Init Observables
    initObservables() {
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.closeDialog$ = this._customersService.closeDialog$;
    }
    //#endregion

    //#region Form
    initForm() {
          // Create the form
        this.form = this._formBuilder.group({
            id              : [''],
            customer_name   : ['', [Validators.required]],
            company_name    : [''],
            main_contact    : [''],
            phone_number    : ['', [Validators.required]],
            state           : [''],
            country         : [''],
            email           : ['', [Validators.email]],
            fax             : [''],
            customer_type   : ['', [Validators.required]],
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
                customer_type       : customerData.customer_type.replace(/\s/g, '').split(','),
                status              : customerData.status.toString(),
                address             : customerData.address,
                billing_address     : customerData.billing_address,
                city                : customerData.city,
                zip_code            : customerData.zip_code,
                position            : customerData.position,
                website             : customerData.website,
                linkedin            : customerData.linkedin,
            });
        }

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
        if (this.data && this.data.isEdit) {
            this.form.value['customer_type'] = this.form.value['customer_type'].join(', ');
            this.updateCustomer(this.form.value);
        } else {
            this.createCustomer(this.form.value);
        }
    }
    discard(): void {
        this.matDialogRef.close();
    }
    //#endregion

}
