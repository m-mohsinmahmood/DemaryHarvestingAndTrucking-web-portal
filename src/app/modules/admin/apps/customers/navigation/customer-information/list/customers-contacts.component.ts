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
import { ContactsDataComponent } from '../edit/contacts-data.component';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCustomerContact } from '../add/add.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { read, utils, writeFile } from 'xlsx';
import { ImportCustomerContactsComponent } from '../import-customer-contacts/import-customer-contacts.component';

@Component({
    selector: 'customers-contacts',
    templateUrl: './customers-contacts.component.html',
    styleUrls: ['./customers-contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CustomersContactsList implements OnInit, AfterViewInit, OnDestroy {
    //#region Variables
    customerList: any;

    isEdit: boolean = false;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    routeID;
    isLoading: boolean = false;
    sortActive: any;
    sortDirection: any;
    search: Subscription;
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    //#endregion

    //#region Observables
    customerContactList$: Observable<any>;
    isLoadingCustomerContactList$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //#endregion

    // Constructor
    constructor(
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute
    ) { }

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
                this.searchResult = data.search;
                this.page = 1;
                this._customersService.getCustomerContact(
                    this.routeID,
                    this.page,
                    this.pageSize,
                    this.sortActive,
                    this.sortDirection,
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
        this.isLoadingCustomerContactList$ =
            this._customersService.isLoadingCustomerContactList$;
        this.customerContactList$ = this._customersService.customerContactList$;
        this.customerContactList$.subscribe((data) => {
            this.customerList = data;
        });
    }
    //#endregion

    //#region Initialize APIs
    initApi() {
        this._customersService.getCustomerContact(this.routeID);
    }
    //#endregion

    //#region Dialog
    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCustomerContact, {
            data: {
                customerId: this.routeID,
                pageSize: this.pageSize,
                sort: this.sortActive,
                order: this.sortDirection,
                search: this.searchResult
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.page = 1;
        });
    }
    openImportDialog(): void {
        const dialogRef = this._matDialog.open(ImportCustomerContactsComponent, {
            data: { 
                customerId: this.routeID,
                limit: this.pageSize,
                sort: this.sortActive,
                order: this.sortDirection,
                search: this.searchResult
            },
        });
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {});
    }

    //#endregion

    //#region Sort Function
    sortData(sort: any) {
        this.sortActive = sort.active;
        this.sortDirection = sort.direction;
        this.page = 1;
        this._customersService.getCustomerContact(
            this.routeID,
            this.page,
            this.pageSize,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this._customersService.getCustomerContact(
            this.routeID,
            this.page,
            this.pageSize,
            this.sortActive,
            this.sortDirection,
            this.searchResult
        );
    }
    //#endregion

    handleExport() {
        let allCustomerContact;
        this._customersService
            .getCustomerContactExport(this.routeID, this.sortActive, this.sortDirection, this.searchResult)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((val) => {
                allCustomerContact = val
                const headings = [['First Name', 'Last Name', 'Website', 'Contact Position', 'Address', 'Cell Number', 'Office Number', 'State', 'City', 'Email', 'Zip Code', 'Fax', 'Linkedln', 'Note 1', 'Note 2']];
                const wb = utils.book_new();
                const ws: any = utils.json_to_sheet([]);
                utils.sheet_add_aoa(ws, headings);
                utils.sheet_add_json(ws, allCustomerContact, {
                    origin: 'A2',
                    skipHeader: true,
                });
                utils.book_append_sheet(wb, ws, 'Report');
                writeFile(wb, 'Customer Contact Data.xlsx');
            })

    }

    downloadTemplate() {
        const headings = [['first_name', 'last_name', 'wesite', 'position', 'address', 'cell_number', 'office_number', 'state', 'city', 'email', 'zip-code', 'fax', 'linkedln', 'note_1', 'note _2']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Customer Contact Data.xlsx');
    }

    //#endregion

    //#region Open Detail Page
    toggleContactsDetails(customerContact: string): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(ContactsDataComponent, {
            data: {
                customerContact,
                pageSize: this.pageSize,
                sort: this.sortActive,
                order: this.sortDirection,
                search: this.searchResult
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.page = 1;
        });
    }
    //#endregion

    //#region Confirmation Customer Field Delete Dialog
    confirmDeleteDialog(id: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Contact?',
                title: 'Customer Contact',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
                this.page = 1
                this._customersService.deleteCustomerContact(id,
                    this.routeID,
                    this.pageSize,
                    this.sortActive,
                    this.sortDirection,
                    this.searchResult);
            }
        });
    }
    //#endregion
}
