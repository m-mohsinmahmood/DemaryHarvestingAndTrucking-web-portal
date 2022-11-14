import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
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
    //#region Input
    @Input() customerDestinationList: Observable<any>;
    @Input() destinationFilters: any;
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
    page: number;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    limit: number;
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
                this.page = 1;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    10,
                    '',
                    '',
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
                filters: this.destinationFilters.value,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    openEditDestinationDialog(destination): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                isEdit: this.isEdit,
                customer_id: this.routeID,
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
        dialogRef.afterClosed().subscribe((result) => { });
    }
    //#endregion

    //#region  Sort Data
    sortData(sort: any) {
        this.page = 1;
        this.destinationSort[0] = sort.active;
        this.destinationSort[1] = sort.direction;
        this._customerService.getCustomerDestination(
            this.routeID,
            this.page,
            this.limit,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._customerService.getCustomerDestination(
            this.routeID,
            this.page,
            this.limit,
            this.destinationSort[0],
            this.destinationSort[1],
            this.searchResult,
            this.destinationFilters.value
        );
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
                this.page = 1
                this._customerService.deleteCustomerDestination(
                    destinationId,
                    this.routeID,
                    this.destinationFilters.value
                );
            }

        });
    }
    //#endregion

    //#region Filters
    applyFilters() {
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
        this._customerService.getCustomerDestination(
            this.routeID,
            1,
            10,
            '',
            '',
            this.searchResult,
            this.destinationFilters.value
        );
    }

    removeFilters() {
        this.destinationFilters.reset();
        this.destinationFilters.value.farm_id = '';
        this.destinationFilters.value.status = '';
        this.destinationFilters.value.calendar_year = '';
        this.calendar_year.setValue('');
        this._customerService.getCustomerDestination(
            this.routeID,
            1,
            10,
            '',
            '',
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
}
