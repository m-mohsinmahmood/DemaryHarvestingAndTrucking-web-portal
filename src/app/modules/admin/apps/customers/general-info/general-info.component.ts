import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from "@angular/router";
import { CustomersService } from '../customers.service';
import { CustomerContacts, Customers } from '../customers.types';
import { AddCustomer } from '../add/add.component';


@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit, OnDestroy
{
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
        private _router: Router,

    )
    {
    }

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
      this.customer$.subscribe((data)=>{
        console.log(data);
      });

      }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    openUpdateDialog(event): void
    {
      this.isEdit = true;
    //Open the dialog
        const dialogRef = this._matDialog.open(AddCustomer,{
         data:{

          customerData: {
            isEdit: this.isEdit,
                id: event.id,
                company_name: event.company_name,
                customer_name: event.customer_name,
                main_contact: event.main_contact,
                position: event.position,
                phone_number: event.phone_number,
                state: event.state,
                country: event.country,
                email: event.email,
                customer_type:event.customer_type,
                status: event.status,
                address: event.address,
                billing_address: event.billing_address,
                fax:event.fax,
                city:event.city,
                zip_code: event.zip_code,
                website: event.website,
                linkedin: event.linkedin,
        }

        }
        });


        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
      });
    }




}
