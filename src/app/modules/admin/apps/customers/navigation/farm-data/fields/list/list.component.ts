import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';
import { Component, Input, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddFieldComponent } from '../add-field/add-field.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { read, utils, writeFile } from 'xlsx';

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
    selector: 'app-list-fields',
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
export class ListFieldComponent implements OnInit {

    //#region Input/Output Variables
    @Input() customerFieldList: Observable<any>;
    @Input() fieldPage: number;
    @Input() fieldPageSize: number;
    @Input() fieldFilters: any;
    @Output() fieldPageChanged = new EventEmitter<{ fieldPageChild: number, fieldPageSizeChild: number }>();
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
    // page: number;
    // pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    fieldSort: any[] = [];
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
        // Field Search
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this.fieldPage = 1;
                this.emitFieldPageChanged();
                this._customerService.getCustomerField(
                    this.routeID,
                    this.fieldPage,
                    this.fieldPageSize,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult,
                    this.fieldFilters.value
                );
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Add/Edit Dialogues
    openAddFieldDialog(): void {
        const dialogRef = this._matDialog.open(AddFieldComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: false,
                status: true,
                pageSize: this.fieldPageSize,
                sort: this.fieldSort[0],
                order: this.fieldSort[1],
                search: this.searchResult,
                filters: this.fieldFilters.value,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.fieldPage = 1;
            this.emitFieldPageChanged();
        });
    }

    openEditFieldDialog(field): void {
        const dialogRef = this._matDialog.open(AddFieldComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
                pageSize: this.fieldPageSize,
                sort: this.fieldSort[0],
                order: this.fieldSort[1],
                search: this.searchResult,
                filters: this.fieldFilters.value,
                customerFieldData: {
                    field_name: field.field_name,
                    field_id: field.field_id,
                    farm_name: field.farm_name,
                    farm_id: field.farm_id,
                    acres: field.acres,
                    status: field.status,
                    calendar_year: field.calendar_year,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.fieldPage = 1;
            this.emitFieldPageChanged();
        });
    }
    //#endregion

    //#region Sort Data
    sortData(sort: any) {
        this.fieldPage = 1;
        this.fieldSort[0] = sort.active;
        this.fieldSort[1] = sort.direction;
        this.emitFieldPageChanged();
        this._customerService.getCustomerField(
            this.routeID,
            this.fieldPage,
            this.fieldPageSize,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.fieldFilters.value
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.fieldPage = event.pageIndex + 1;
        this.fieldPageSize = event.pageSize;
        this.emitFieldPageChanged();
        this._customerService.getCustomerField(
            this.routeID,
            this.fieldPage,
            this.fieldPageSize,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.fieldFilters.value
        );
    }
    //#endregion

    //#region Import/Export Function
    handleImport() {

    }

    handleExport() {
        let allCustomerField;
        this._customerService
            .getCustomerFieldExport(this.routeID, this.fieldSort[0], this.fieldSort[1], this.searchResult, this.fieldFilters.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                allCustomerField = value;
                const headings = [['Farm Name', 'Field Name', 'Acres', 'Status', 'Calendar Year']];
                const wb = utils.book_new();
                const ws: any = utils.json_to_sheet([]);
                utils.sheet_add_aoa(ws, headings);
                utils.sheet_add_json(ws, allCustomerField, {
                    origin: 'A2',
                    skipHeader: true,
                });
                utils.book_append_sheet(wb, ws, 'Report');
                writeFile(wb, 'Customer Field Data.xlsx');
            })

    }

    downloadTemplate() {
        const headings = [['Farm Name', 'Field Name', 'Acres', 'Status', 'Calendar Year']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Customer Field Data.xlsx');
    }
    //#endregion


    //#region emit field page changed
    emitFieldPageChanged() {
        this.fieldPageChanged.emit({ fieldPageChild: this.fieldPage, fieldPageSizeChild: this.fieldPageSize });
    }
    //#endregion 

    //#region Filters
    applyFilters() {
        this.fieldPage = 1;
        this.fieldFilters.value.farm_id?.id
            ? (this.fieldFilters.value.farm_id =
                this.fieldFilters.value.farm_id?.id)
            : '';
        !this.fieldFilters.value.farm_id
            ? (this.fieldFilters.value.farm_id = '')
            : '';
        !this.fieldFilters.value.status
            ? (this.fieldFilters.value.status = '')
            : '';
        !this.fieldFilters.value.calendar_year
            ? (this.fieldFilters.value.calendar_year = '')
            : '';
        this.calendar_year.value ? (this.fieldFilters.value.calendar_year = this.calendar_year.value) : ''
        this.emitFieldPageChanged();
        this._customerService.getCustomerField(
            this.routeID,
            1,
            this.fieldPageSize,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.fieldFilters.value
        );
    }

    removeFilters() {
        this.fieldPage = 1;
        this.fieldFilters.reset();
        this.fieldFilters.value.farm_id = '';
        this.fieldFilters.value.status = '';
        this.fieldFilters.value.calendar_year = '';
        this.calendar_year.setValue('');
        this.emitFieldPageChanged();
        this._customerService.getCustomerField(
            this.routeID,
            1,
            this.fieldPageSize,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.fieldFilters.value
        );
    }

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment();
        ctrlValue.year(normalizedYear.year());
        this.calendar_year.setValue(ctrlValue.format('YYYY'));
        this.fieldFilters.value.calendar_year = ctrlValue.format('YYYY');
        datepicker.close();
    }
    initCalendar() {
        //Calender Year Initilize
        this.calendar_year = new FormControl();
    }

    getDropdownFarms() {
        let value = this.fieldFilters.controls['farm_id'].value;
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

    //#region Confirmation Customer Field Delete Dialog
    confirmDeleteDialog(fieldId: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Field?',
                title: 'Customer Field',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
                this.fieldPage = 1;
                this.emitFieldPageChanged();
                this._customerService.deleteCustomerField(
                    fieldId,
                    this.routeID,
                    this.fieldPageSize,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult,
                    this.fieldFilters.value
                );
            }

        });
    }
    //#endregion
}
