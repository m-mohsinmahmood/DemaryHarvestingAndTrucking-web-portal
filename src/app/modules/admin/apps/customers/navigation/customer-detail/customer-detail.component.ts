import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    APP_INITIALIZER,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../customers.service';
import { AddCustomer } from '../../add/add.component';
import { Customers } from '../../customers.types';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetail implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID

    search: Subscription;
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    isEdit: boolean;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public _customerService: CustomersService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
        this._customerService.getCustomerById(this.routeID);
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.customer$ = this._customersService.customer$;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    openUpdateDialog(event): void {
        this.isEdit = true;
        //Open the dialog
        const dialogRef = this._matDialog.open(AddCustomer, {
            data: {
                isEdit: this.isEdit,
                customerData: {
                    id: event.id,
                    company_name: event.company_name,
                    customer_name: event.customer_name,
                    main_contact: event.main_contact,
                    position: event.position,
                    phone_number: event.phone_number,
                    state: event.state,
                    country: event.country,
                    email: event.email,
                    customer_type: event.customer_type,
                    status: event.status,
                    address: event.address,
                    billing_address: event.billing_address,
                    fax: event.fax,
                    city: event.city,
                    zip_code: event.zip_code,
                    website: event.website,
                    linkedin: event.linkedin,
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
