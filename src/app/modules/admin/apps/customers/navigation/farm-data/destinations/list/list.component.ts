import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddDestinationComponent } from '../add-destination/add-destination.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { read, utils, writeFile } from 'xlsx';
import { ImportDestinationsComponent } from '../import-destinations/import-destinations.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@Component({
    selector: 'app-list-destinations',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ListDestinationComponent implements OnInit {
    //#region Input/Output Variables
    @Input() customerDestinationList: Observable<any>;
    @Input() destinationPage: number;
    @Input() destinationPageSize: number;
    @Input() destinationFilters: any;
    @Output() destinationPageChanged = new EventEmitter<{ destinationPageChild: number, destinationPageSizeChild: number }>();

    //#endregion

    //#region Search form variables
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    //#endregion

    //#region Auto Complete Farms
    allFarms: Observable<any>;
    farm_search$ = new Subject();
    //#endregion

    //#region Variables
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    routeID: any;
    search: any;
    searchResult: any;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    destinationSort: any[] = [];
    isEdit: boolean;
    calendar_year;
    //#endregion

    constructor(
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        private _customerService: CustomersService
    ) { }

    //#region Lifecycle hooks
    ngOnInit(): void {
        this.initCalendar();
        this.farmSearchSubscription();
        // get Activated Route
        this.activatedRoute.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                this.routeID = params.Id;
            });

        // Farm Search
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this.destinationPage = 1;
                this.emitDestinationPageChanged();
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.destinationPage,
                    this.destinationPageSize,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult,
                    this.destinationFilters.value
                );
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Add/Edit Dialog

    //Destination
    openAddDestinationDialog(): void {
        this.isEdit = false;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: this.isEdit,
                pageSize: this.destinationPageSize,
                sort: this.destinationSort[0],
                order: this.destinationSort[1],
                search: this.searchResult,
                filters: this.destinationFilters.value,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.destinationPage = 1;
            this.emitDestinationPageChanged();
        });
    }

    openEditDestinationDialog(destination): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                isEdit: this.isEdit,
                customer_id: this.routeID,
                pageSize: this.destinationPageSize,
                sort: this.destinationSort[0],
                order: this.destinationSort[1],
                search: this.searchResult,
                filters: this.destinationFilters.value,
                customerDestinationData: {
                    id: destination.destination_id,
                    farm_name: destination.farm_name,
                    name: destination.destination_name,
                    calendar_year: destination.calendar_year,
                    farm_id: destination.farm_id,
                    destination_id: destination.destination_id,
                    status: destination.status,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.destinationPage = 1;
            this.emitDestinationPageChanged();
        });
    }
    openImportDialog(): void {
        const dialogRef = this._matDialog.open(ImportDestinationsComponent, {
            data: { 
                customer_id: this.routeID,
                limit: this.destinationPageSize,
                sort: this.destinationSort[0],
                order: this.destinationSort[1],
                search: this.searchResult,
                filters: this.destinationFilters.value,
            },
        });
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {});
    }
    //#endregion

    //#region  Sort Data
    sortData(sort: any) {
        this.destinationPage = 1;
        this.destinationSort[0] = sort.active;
        this.destinationSort[1] = sort.direction;
        this.emitDestinationPageChanged();
        this._customerService.getCustomerDestination(
            this.routeID,
            this.destinationPage,
            this.destinationPageSize,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.destinationPage = event.pageIndex + 1;
        this.destinationPageSize = event.pageSize;
        this.emitDestinationPageChanged();
        this._customerService.getCustomerDestination(
            this.routeID,
            this.destinationPage,
            this.destinationPageSize,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
    }
    //#endregion
    
    //#region Import/Export Function
    handleImport() {

    }

    handleExport() {
        let allCustomerDestination;
        this._customerService.getCustomerDestinationExport(this.routeID,this.destinationSort[0],this.destinationSort[1],this.searchResult,this.destinationFilters.value)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((value) => {
            allCustomerDestination = value
            const headings = [['Farm Name', 'Destination Name','Status', 'Calendar Year']];
            const wb = utils.book_new();
            const ws: any = utils.json_to_sheet([]);
            utils.sheet_add_aoa(ws, headings);
            utils.sheet_add_json(ws, allCustomerDestination, {
                origin: 'A2',
                skipHeader: true,
            });
            utils.book_append_sheet(wb, ws, 'Report');
            writeFile(wb, 'Customer Destination Data.xlsx');
        });

    }

    downloadTemplate() {
        const headings = [['customer_id', 'farm_id','name','status','calendar_year']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Customer Destination Data.xlsx');
    }
    //#endregion

    //#region Confirmation Customer Destination Delete Dialog
    confirmDeleteDialog(destinationId: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Destination?',
                title: 'Customer Destination',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
                this.destinationPage = 1
                this.emitDestinationPageChanged();
                this._customerService.deleteCustomerDestination(
                    destinationId,
                    this.routeID,
                    this.destinationPageSize,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult,
                    this.destinationFilters.value
                );
            }

        });
    }
    //#endregion

    //#region Filters
    applyFilters() {
        this.destinationPage = 1;
        this.destinationFilters.value.farm_id?.id
            ? (this.destinationFilters.value.farm_id =
                this.destinationFilters.value.farm_id?.id)
            : '';
        !this.destinationFilters.value.farm_id
            ? (this.destinationFilters.value.farm_id = '')
            : '';
        !this.destinationFilters.value.status
            ? (this.destinationFilters.value.status = '')
            : '';
        !this.destinationFilters.value.calendar_year
            ? (this.destinationFilters.value.calendar_year = '')
            : '';
        this.calendar_year.value ? (this.destinationFilters.value.calendar_year = this.calendar_year.value) : ''
        this.emitDestinationPageChanged();
        this._customerService.getCustomerDestination(
            this.routeID,
            1,
            this.destinationPageSize,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
    }

    removeFilters() {
        this.destinationPage = 1;
        this.destinationFilters.reset();
        this.destinationFilters.value.farm_id = '';
        this.destinationFilters.value.status = '';
        this.destinationFilters.value.calendar_year = '';
        this.calendar_year.setValue('');
        this.emitDestinationPageChanged();
        this._customerService.getCustomerDestination(
            this.routeID,
            1,
            this.destinationPageSize,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
    }

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment();
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue.format('YYYY'));
        this.destinationFilters.value.calendar_year = ctrlValue.format('YYYY');
        datepicker.close();
    }
    initCalendar() {
        //Calender Year Initilize
        this.calendar_year = new FormControl();
    }

    getDropdownFarms() {
        let value = this.destinationFilters.controls['farm_id'].value;
        this.allFarms = this._customerService.getDropdownCustomerFarms(
            this.routeID,
            value != null ? value : ''
        );
    }
    //Auto Complete Farms Display Function
    displayFarmForAutoComplete(farm: any) {
        return farm ? `${farm.name}` : undefined;
    }
    //Search Function
    farmSearchSubscription() {
        this.farm_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allFarms = this._customerService.getDropdownCustomerFarms(
                    this.routeID,
                    value
                );
            });
    }
    //#endregion

    //#region emit farm page changed
    emitDestinationPageChanged() {
        this.destinationPageChanged.emit({ destinationPageChild: this.destinationPage, destinationPageSizeChild: this.destinationPageSize });
    }
    //#endregion
}
