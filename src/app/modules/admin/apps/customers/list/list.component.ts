/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
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
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime,Observable,Subject,Subscription,takeUntil} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Customers } from 'app/modules/admin/apps/customers/customers.types';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { AddCustomer } from '../add/add.component';
import { ImportCustomersComponent } from '../import-customers/import-customers.component';
import { Router } from '@angular/router';
import { read, utils, writeFile } from 'xlsx';


@Component({
    selector: 'customers-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CustomersListComponent implements OnInit {

    //#region Observables
    search: Subscription;
    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    customers$: Observable<Customers[]>;
    isLoadingCustomers$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables

    isEdit: boolean = false;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    sort: any;
    order: any;
    limit: number;
    isLoading: boolean = false;
    statusList: string[] = ['Hired', 'Evaluated', 'In-Process', 'New', 'N/A', 'Not Being Considered'];
    country_list = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    customerFiltersForm: FormGroup;
    //#endregion

    //Constructor
    constructor(
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        private _router: Router
    ) { }

    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initApis();
        this.initFiltersForm();
        this.initObservables();
        localStorage.removeItem("state");
    }
    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Init Observables and Apis
    initObservables() {
        this.isLoadingCustomers$ = this._customersService.isLoadingCustomers$;
        this.isLoadingCustomer$ = this._customersService.isLoadingCustomer$;
        this.customers$ = this._customersService.customers$;
        this.customer$ = this._customersService.customer$;
        this.search = this.searchform.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((data) => {
                this.searchResult = data.search;
                this.page = 1;
                this._customersService.getCustomers(
                    1,
                    50,
                    '',
                    '',
                    this.searchResult,
                    this.customerFiltersForm.value
                );
            });
    }

    initApis() {
        this._customersService.getCustomers();
    }

    //#endregion

    //#region Add/Import Dialog
    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCustomer, {
            data: {
                isEdit: this.isEdit,
                filters: this.customerFiltersForm.value,
            },
        });
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            //Call this function only when success is returned from the create API call//
        });
    }

    openImportDialog(): void {
        const dialogRef = this._matDialog.open(ImportCustomersComponent, {
            data: {
                limit: this.pageSize,
                sort: this.sort,
                order: this.order,
                search: this.searchResult,
                filters: this.customerFiltersForm.value,
            },
        });
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {});
    }

    //#endregion

    //#region Sort Function
    sortData(sort: any) {
        this.page = 1;
        this.sort = sort.active;
        this.order = sort.direction
        this._customersService.getCustomers(
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult,
            this.customerFiltersForm.value
        );
    }
    //#endregion

    //#region  Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._customersService.getCustomers(this.page, this.limit, '', '', this.searchResult, this.customerFiltersForm.value);
    }
    //#endregion

    //#region Export Function
    handleExport() {
        let allCustomers;
        this._customersService.getCustomerExport(
            this.sort,
            this.order,
            this.searchResult,
            this.customerFiltersForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                allCustomers = value
                const headings = [['Customer Name', 'Main Contact', 'Position', 'Phone Number', 'State', 'Country', 'Email', 'Customer Type', 'Address', 'Billing Address', 'Fax', 'City', 'Zip Code', 'Website', 'Linkedin', 'Status']];
                const wb = utils.book_new();
                const ws: any = utils.json_to_sheet([]);
                utils.sheet_add_aoa(ws, headings);
                utils.sheet_add_json(ws, allCustomers, {
                    origin: 'A2',
                    skipHeader: true,
                });
                utils.book_append_sheet(wb, ws, 'Report');
                writeFile(wb, 'Customer Data.xlsx');
            })

    }

    downloadTemplate() {
        window.open('https://dhtstorageaccountdev.blob.core.windows.net/bulkcreate/Customer_Data.xlsx', "_blank");
    }
    //#endregion

    //#region Details Page

    //  Toggle Customer  Details
    toggleGeneralInfo(customerId: string, state: string): void {
        this._router.navigateByUrl(`apps/customers/details/${customerId}`, { state: { title: 'Customer Information' } });
    }
    //  Toggle Customer Contacts Details
    toggleContactsDetails(customerId: string): void {
        this._customersService.getCustomerById(customerId);
        this._router.navigateByUrl(`apps/customers/details/${customerId}`, { state: { title: 'Contact Data' } });
    }

    //#endregion

    //#region Filters
    applyFilters() {
        this.page = 1;
        !this.customerFiltersForm.value.type ? (this.customerFiltersForm.value.type = '') : ('');
        !this.customerFiltersForm.value.status ? (this.customerFiltersForm.value.status = '') : ('');
        this._customersService.getCustomers(1, 50, '', '', this.searchResult, this.customerFiltersForm.value)
    }

    removeFilters() {
        this.page = 1;
        this.customerFiltersForm.reset();
        this.customerFiltersForm.value.type = '';
        this.customerFiltersForm.value.status = '';
        this._customersService.getCustomers(1, 50, '', '', this.searchResult, this.customerFiltersForm.value)
    }

    initFiltersForm() {
        this.customerFiltersForm = this._formBuilder.group({
            type: [''],
            status: [''],
        });
    }
    //#endregion

}
