/* eslint-disable max-len */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
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
import {
    Customers,
    InventoryBrand,
    InventoryCategory,
    InventoryPagination,
    InventoryProduct,
    InventoryTag,
    InventoryVendor,
} from 'app/modules/admin/apps/customers/customers.types';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { AddCustomer } from '../add/add.component';
import { Router } from '@angular/router';
import { read, utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';

@Component({
    selector: 'customers-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CustomersListComponent implements OnInit {
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    search: Subscription;
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    exportCrop$: Observable<Customers>;

    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;

    products$: Observable<InventoryProduct[]>;
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
    statusList: string[] = ['Hired', 'Evaluated', 'In-Process', 'New', 'N/A', 'Not Being Considered'];
    country_list = ['Afghanistan','Albania','Algeria','Andorra','Angola','Anguilla','Antigua &amp; Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia &amp; Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Cape Verde','Cayman Islands','Chad','Chile','China','Colombia','Congo','Cook Islands','Costa Rica','Cote D Ivoire','Croatia','Cruise Ship','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Polynesia','French West Indies','Gabon','Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada','Guam','Guatemala','Guernsey','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyz Republic','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Namibia','Nepal','Netherlands','Netherlands Antilles','New Caledonia','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Pierre &amp; Miquelon','Samoa','San Marino','Satellite','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','St Kitts &amp; Nevis','St Lucia','St Vincent','St. Lucia','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor L\'Este','Togo','Tonga','Trinidad &amp; Tobago','Tunisia','Turkey','Turkmenistan','Turks &amp; Caicos','Uganda','Ukraine','United Arab Emirates','United Kingdom','Uruguay','Uzbekistan','Venezuela','Vietnam','Virgin Islands (US)','Yemen','Zambia','Zimbabwe'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.initApis();
        this.initObservables();
    }

    initObservables() {
        this.isLoadingCustomers$ = this._customersService.isLoadingCustomers$;
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.customers$ = this._customersService.customers$;
        this.customer$ = this._customersService.customer$;
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customersService.getCustomers(
                    1,
                    10,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    initApis() {
        this._customersService.getCustomers();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {}
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

    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCustomer);
        dialogRef.afterClosed().subscribe((result) => {
            //Call this function only when success is returned from the create API call//
            //this._cropsService.getCrops();
        });
    }
    openEditDialog(event): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddCustomer, {
            data: {
                customerData: {
                    isEdit: this.isEdit,
                    id: event.id,
                    company_name: event.company_name,
                    main_contact: event.main_contact,
                    position: event.position,
                    phone_number: event.phone_number,
                    state: event.state,
                    country: event.country,
                    email: event.email,
                    customer_type: event.customer_type,
                    status: event.status,
                },
                paginationData: {
                    page: this.page,
                    limit: this.limit,
                    search: this.searchResult,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            //Call this function only when success is returned from the update API call//
            // this._cropsService.getCustomers();
        });
    }

    sortData(sort: any) {
        this._customersService.getCustomers(
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
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        this._customersService.getCustomers(
            page,
            limit,
            '',
            '',
            this.searchResult
        );
    }
    // Export
    handleExport() {
        const headings = [['Crop Name', 'Variety', 'Bushel Weight']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        // utils.sheet_add_json(ws, {
        //     origin: 'A2',
        //     skipHeader: true,
        // });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Crops Data.xlsx');
    }

    // ----------------------------------------------------------------------------------------------

    toggleGeneralInfo(productId: string): void {
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }
        // Get the product by id
        this._customersService.getCustomerById(productId);
        // .subscribe((product) => {
        //     this._router.navigateByUrl('apps/customers/general-information/'+ productId)
        //     // Set the selected product
        //     this.selectedProduct = product;

        //     // Fill the form
        //     this.selectedProductForm.patchValue(product);

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }
    /**
     * Close the details
     */
    closeGeneralInfo(): void {
        this.selectedProduct = null;
    }

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void {
        // Get the Customer by id
        this.customer$ = this._customersService.getCustomerById(productId);
        this.customer$.subscribe((data) => {
            console.log(data.id);
            this._router.navigateByUrl('apps/customers/details/' + data?.id);
        });
    }
    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Toggle Customer Contacts
     *
     * @param productId
     */
    toggleContactsDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }
        // Get the product by id
        this._customersService.getCustomerById(productId);
        // .subscribe((product) => {
        //     this._router.navigateByUrl(
        //         'apps/customers/contacts-data/' + productId
        //     );
        //     // Set the selected product
        //     this.selectedProduct = product;

        //     // Fill the form
        //     this.selectedProductForm.patchValue(product);

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
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
