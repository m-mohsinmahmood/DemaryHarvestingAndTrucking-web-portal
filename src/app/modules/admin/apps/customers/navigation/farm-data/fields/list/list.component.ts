import {
    debounceTime,
    distinctUntilChanged,
    Observable,
    Subject,
    takeUntil,
} from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddFieldComponent } from '../add-field/add-field.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-list-fields',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListFieldComponent implements OnInit {
    //#region Input
    @Input() customerFieldList: Observable<any>;
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
    fieldSort: any[] = [];
    formFilters: FormGroup;
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        private _customerService: CustomersService
    ) {}

    //#region Lifecycle hooks
    ngOnInit(): void {
        this.initFiltersForm();
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
                this.page = 1;
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    10,
                    '',
                    '',
                    this.searchResult,
                    this.formFilters.value
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
            },
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }

    openEditFieldDialog(field): void {
        const dialogRef = this._matDialog.open(AddFieldComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
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
        dialogRef.afterClosed().subscribe((result) => {});
    }
    //#endregion

    //#region Sort Data
    sortData(sort: any) {
        this.page = 1;
        this.fieldSort[0] = sort.active;
        this.fieldSort[1] = sort.direction;
        this._customerService.getCustomerField(
            this.routeID,
            this.page,
            this.limit,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.formFilters.value
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._customerService.getCustomerField(
            this.routeID,
            this.page,
            this.limit,
            this.fieldSort[0],
            this.fieldSort[1],
            this.searchResult,
            this.formFilters.value
        );
    }
    //#endregion

    //#region Filters
    applyFilters() {
        this.formFilters.value.farm_id?.id
            ? (this.formFilters.value.farm_id =
                  this.formFilters.value.farm_id?.id)
            : '';
        !this.formFilters.value.farm_id
            ? (this.formFilters.value.farm_id = '')
            : '';
        !this.formFilters.value.status
            ? (this.formFilters.value.status = '')
            : '';
        this._customerService.getCustomerField(
            this.routeID,
            this.page,
            10,
            '',
            '',
            this.searchResult,
            this.formFilters.value
        );
    }

    removeFilters() {
        this.formFilters.reset();
        this.formFilters.value.farm_id = '';
        this.formFilters.value.status = '';
        this._customerService.getCustomerField(
            this.routeID,
            this.page,
            10,
            '',
            '',
            this.searchResult,
            this.formFilters.value
        );
    }

    initFiltersForm() {
        this.formFilters = this._formBuilder.group({
            farm_id: [''],
            status: [''],
        });
    }

    getDropdownFarms() {
        let value = this.formFilters.controls['farm_id'].value;
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
                message: 'Are you sure you want to delete this Destination?',
                title: 'Customer Destination',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult)
                this._customerService.deleteCustomerField(
                    fieldId,
                    this.routeID
                );
        });
    }
    //#endregion
}
