import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { Customers } from '../customers.types';
import { states } from './../../../../../../JSON/state';
import { countryList } from 'JSON/country';

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
    states: string[]= [];
    countries: string[] = [];
    stateOptions: Observable<string[]>;
    countryOptions: Observable<string[]>;
    secondFormGroup: any;
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

        // passing U.S. states
        this.states = states;
        this.countries = countryList;

         //Auto Complete functions for State and Country
         this.stateOptions = this.form.valueChanges.pipe(
            startWith(''),
            map(value => this._filterStates(value.state || '')),
        );

        this.countryOptions = this.form.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCountries(value.country || '')),
        );

    }

    //Auto Complete functions for State and Country

    private _filterStates(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.states.filter(state => state.toLowerCase().includes(filterValue));
    }

    private _filterCountries(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.countries.filter(country => country.toLowerCase().includes(filterValue));
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
            email           : ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            fax             : [''],
            customer_type   : ['', [Validators.required]],
            status          : ['',[Validators.required]],
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
            this._customersService.createCustomer(this.form.value,this.data?.filters);
        }
    }
    discard(): void {
        this._customersService.isLoadingCustomer.next(false);
        this.matDialogRef.close();
    }
    //#endregion

}
