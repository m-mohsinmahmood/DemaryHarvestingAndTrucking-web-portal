import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddFarmComponent } from '../../farms/add-farm/add-farm.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-list-farms',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListFarmComponent implements OnInit {
    //#region Input
    @Input() customerFarmList: Observable<any>;
    @Input() farmPage: number;
    @Input() farmPageSize: number;
    //#endregion

    //#region Output
    @Output() farmPageChanged = new EventEmitter<{ farmPageChild: number, farmPageSizeChild: number }>();
    //#endregion
    //#region Search form variables
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
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
    farmSort: any[] = [];
    //#endregion

    constructor(
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        private _customerService: CustomersService
    ) { }

    //#region Lifecycle hooks
    ngOnInit(): void {
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
                this.farmPage = 1;
                this.emitFarmPageChanged();
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.farmPage,
                    this.farmPageSize,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Add/Edit Dialogues
    // Farms
    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                id: this.routeID,
                isEdit: false,
                status: true,
                pageSize: this.farmPageSize,
                sort: this.farmSort[0],
                order: this.farmSort[1],
                search: this.searchResult
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.farmPage = 1;
            this.emitFarmPageChanged();
        });
    }

    openEditFarmDialog(farm): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
                pageSize: this.farmPageSize,
                sort: this.farmSort[0],
                order: this.farmSort[1],
                search: this.searchResult,
                customerFarmData: {
                    name: farm.name,
                    id: farm.id,
                    status: farm.status,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.farmPage = 1;
            this.emitFarmPageChanged();
        });
    }
    //#endregion

    //#region  Sort Data
    sortData(sort: any) {
        this.farmPage = 1;
        this.farmSort[0] = sort.active;
        this.farmSort[1] = sort.direction;
        this.emitFarmPageChanged();
        this._customerService.getCustomerFarm(
            this.routeID,
            this.farmPage,
            this.farmPageSize,
            this.farmSort[0],
            this.farmSort[1],
            this.searchResult
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.farmPage = event.pageIndex + 1;
        this.farmPageSize = event.pageSize;
        this.emitFarmPageChanged();
        this._customerService.getCustomerFarm(
            this.routeID,
            this.farmPage,
            this.farmPageSize,
            this.farmSort[0],
            this.farmSort[1],
            this.searchResult
        );
    }
    //#endregion

    //#region Confirmation Customer Farm Delete Dialog
    confirmDeleteDialog(farmId: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Farm?',
                title: 'Customer Farm',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
                this.farmPage = 1
                this.emitFarmPageChanged();
                this._customerService.deleteCustomerFarm(
                    farmId,
                    this.routeID,
                    this.farmPageSize,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
            }

        });
    }
    //#endregion
    
    //#region emit farm page changed
    emitFarmPageChanged() {
        this.farmPageChanged.emit({ farmPageChild: this.farmPage, farmPageSizeChild: this.farmPageSize });
    }
    //#endregion
}
