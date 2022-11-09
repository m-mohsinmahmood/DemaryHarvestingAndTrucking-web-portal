import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../customers.service';
import { AddCustomer } from '../../add/add.component';
import { Customers } from '../../customers.types';
import { ConfirmDialogModel, ConfirmationDialogComponent } from '../../../../ui/confirmation-dialog/confirmation-dialog.component';


@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetail implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //#region Variables
    isLoading: boolean = false;
    isEdit: boolean;
    routeID;
    result: string = '';
    //#endregion

    //#region Observables
    search: Subscription;
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    //#endregion

    // Constructor
    constructor(
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public _customerService: CustomersService,
    ) {}

    //#region Lifecycle Functions
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
        this.initApi();
        this.initObservables();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region init API
    initApi(){
        this._customerService.getCustomerById(this.routeID);
    }
    //#endregion

    //#region init Observables
    initObservables(){
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.customer$ = this._customersService.customer$;
    }
    //#endregion

    //#region Update Dialog
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
        });
    }
    //#endregion

    //#region Delete Customer

    deleteCustomer(id: string){
        this._customerService.deleteCustomer(id)
    }
    //#endregion

    //#region Confirmation Dialog
    confirmDialog(customerId: string): void {
        // const message = `Are you sure you want to do this?`;

        // const dialogData = new ConfirmDialogModel("Delete Customer", message);

        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Are you sure you want to delete this entity?',
            title: 'Customer',
          },
        //   height: '400px',
        //   width: '800px',

        });

        dialogRef.afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
        });
      }
    //#endregion
}
