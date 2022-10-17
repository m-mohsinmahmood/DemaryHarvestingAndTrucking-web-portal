/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/component-class-suffix */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    Input,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    Subscription,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsDataComponent } from './contacts-data/contacts-data.component';
import {
    CustomerContacts,
    InventoryBrand,
    InventoryCategory,
    InventoryPagination,
    InventoryProduct,
    InventoryTag,
    InventoryVendor,
} from 'app/modules/admin/apps/customers/customers.types';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCustomerContact } from './add/add.component';

@Component({
    selector: 'customers-contacts',
    templateUrl: './customers-contacts.component.html',
    styleUrls: ['./customers-contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CustomersContactsList implements OnInit, AfterViewInit, OnDestroy {
    search: Subscription;

    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;

    // customers: any;
    routeID;
    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // isContactData: boolean = false;

    //#region Observables
    customerContactList$: Observable<any>;
    isLoadingCustomerContactList$: Observable<boolean>;
    customerList: any;
    //#endregion

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        private _router: Router,
        public activatedRoute: ActivatedRoute
    ) {}

    //#region Lifecycle Functions
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
        this.initApi();
        this.initObservables();

    }

    ngAfterViewInit(): void {

        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                alert(1);
                this.searchResult = data.search;
                this._customersService.getCustomerContact(
                    this.routeID,
                    1,
                    10,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion
    //#region Initialize Observables
    initObservables() {
        this.isLoadingCustomerContactList$ = this._customersService.isLoadingCustomerContactList$;
        this.customerContactList$ = this._customersService.customerContactList$;
        this.customerContactList$.subscribe((data) => {this.customerList = data});
    }
    //#endregion
    //#region Initialize APIs
    initApi() {
        this._customersService.getCustomerContact(this.routeID);
    }
    //#endregion

    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCustomerContact, {
            data: { customerId: this.routeID },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    sortData(sort: any) {
        this._customersService.getCustomerContact(
            this.routeID,
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }

    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._customersService.getCustomerContact(this.routeID,this.page,this.limit,'','',this.searchResult);
    }


    /**
     * Toggle Customer Contacts
     *
     */
    toggleContactsDetails(customerContact: string): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(ContactsDataComponent, {
            data: {
                customerContact,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    toggleCustomerContacts() {
        alert(1);
        // this.isContactData = false;
    }
    /**
     * Close the details
     */
    closeContactsDetails(): void {
        this.selectedProduct = null;
    }

    createProduct(data: any): void {
        // Create the product
        this._customersService.createCustomer(data);
        /* subscribe((newProduct) => {

            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            this.selectedProductForm.patchValue(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }); */
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
