import { OnDestroy, AfterViewInit } from '@angular/core';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../customers.service';
import { AddFieldComponent } from './add-field/add-field.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AddFarmComponent } from './add-farm/add-farm.component';
import { boolean } from 'joi';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit, OnDestroy, AfterViewInit {
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    searchformfarm: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    searchformfield: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    searchformcrop: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    //#region Observables

    // Customer Farm Listing
    customerFarmList$: Observable<any[]>;
    isLoadingCustomerFarmList$: Observable<boolean>;
    // Customer Farm By ID
    customerFarm$: Observable<any>;
    isLoadingCustomerFarm$: Observable<boolean>;

    // Customer Field Listing
    customerFieldList$: Observable<any[]>;
    isLoadingCustomerFieldList$: Observable<boolean>;
    // Customer Field By ID
    customerField$: Observable<any>;
    isLoadingCustomerField$: Observable<boolean>;

    // Customer Crop Listing
    customerCropList$: Observable<any[]>;
    isLoadingCustomerCropList$: Observable<boolean>;
    // Customer Crop By ID
    customerCrop$: Observable<any>;
    isLoadingCustomerCrop$: Observable<boolean>;

    // Customer Destination Listing
    customerDestinationList$: Observable<any>;
    isLoadingCustomerDestinationList$: Observable<boolean>;
    // Customer Destination By ID
    customerDestination$: Observable<any[]>;
    isLoadingCustomerDestination$: Observable<boolean>;

    //#endregion

    search: Subscription;
    searchDestination: Subscription;

    isEdit: boolean = false;
    pageSize = 10;
    pageSizeSummary = 5;
    currentPage = 0;
    // currentPage2 = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    pageSizeOptionsSummary: number[] = [5, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;
    routeID: any;
    isLoading: any;
    customerCrops$: Observable<any>;
    customerCrop: any;
    activeTab: any;

    // summary observables
    summaryfarms$: Observable<any>;
    summaryfields$: Observable<any>;
    summarydestinations$: Observable<any>;

    constructor(
        private _matDialog: MatDialog,
        private _customerService: CustomersService,
        public activatedRoute: ActivatedRoute
    ) {}

    //#region Life Cycle Functions
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });

        // searching in tabs
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                switch (this.activeTab) {
                    case 'Farms':
                        this._customerService.getCustomerFarm(
                            this.routeID,
                            1,
                            10,
                            '',
                            '',
                            this.searchResult
                        );
                        break;
                    case 'Fields':
                        this._customerService.getCustomerField(
                            this.routeID,
                            1,
                            10,
                            '',
                            '',
                            this.searchResult
                        );
                        break;
                    case 'Crops':
                        this._customerService.getCustomerCrops(
                            this.routeID,
                            1,
                            3,
                            '',
                            '',
                            this.searchResult
                        );
                        break;
                    case 'Destinations':
                        this._customerService.getCustomerDestination(
                            this.routeID,
                            1,
                            10,
                            '',
                            '',
                            this.searchResult
                        );
                        break;
                    default:
                }
            });

        // search summary farm
        this.search = this.searchformfarm.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    1,
                    5,
                    '',
                    '',
                    this.searchResult
                );
            });

        // search summary field
        this.search = this.searchformfield.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customerService.getCustomerField(
                    this.routeID,
                    1,
                    5,
                    '',
                    '',
                    this.searchResult
                );
            });

        // search summary crop
        this.search = this.searchformcrop.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    1,
                    5,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    ngAfterViewInit(): void {
        this.initApis();
        this.initObservables();
    }

    ngOnDestroy(): void {}
    //#endregion

    //#region Initialize Observables
    initObservables() {
        this.initCustomerFarmObservables();
        this.initCustomerFieldObservables();
        this.initCustomerCropObservables();
        this.initCustomerDestinationObservables();
    }

    initCustomerFarmObservables() {
        // Data
        this.customerFarmList$ = this._customerService.customerFarmList$;
        this.customerFarm$ = this._customerService.customerFarm$;

        // Loaders
        this.isLoadingCustomerFarmList$ =
            this._customerService.isLoadingCustomerFarmList$;
        this.isLoadingCustomerFarm$ =
            this._customerService.isLoadingCustomerFarm$;
    }

    initCustomerFieldObservables() {
        // Data
        this.customerFieldList$ = this._customerService.customerFieldList$;
        this.customerField$ = this._customerService.customerField$;
        // Loaders
        this.isLoadingCustomerFarmList$ =
            this._customerService.isLoadingCustomerFieldList$;
        this.isLoadingCustomerField$ =
            this._customerService.isLoadingCustomerField$;
    }

    initCustomerCropObservables() {
        // Data
        this.customerCropList$ = this._customerService.customerCropList$;
        this.customerCrop$ = this._customerService.customerCrop$;
        // Loaders
        this.isLoadingCustomerCropList$ =
            this._customerService.isLoadingCustomerCropList$;
        this.isLoadingCustomerCrop$ =
            this._customerService.isLoadingCustomerCrop$;
    }

    initCustomerDestinationObservables() {
        // Data
        this.customerDestinationList$ =
            this._customerService.customerDestinationList$;
        this.customerDestination$ = this._customerService.customerDestination$;
        // Loaders
        this.isLoadingCustomerDestinationList$ =
            this._customerService.isLoadingCustomerDestinationList$;
        this.isLoadingCustomerDestination$ =
            this._customerService.isLoadingCustomerDestination$;
    }

    //#endregion
    //#region Initial APIs
    initApis() {
        this._customerService.getCustomerFarm(this.routeID);

        // for sorting
        this.activeTab = 'Farms';
    }
    //#endregion
    //#region Add/Edit Dialogues

    farmTabChange(event) {
        this.activeTab = event.tab.textLabel;
        switch (event.tab.textLabel) {
            case 'Farms':
                this._customerService.getCustomerFarm(this.routeID);
                break;
            case 'Fields':
                this._customerService.getCustomerField(this.routeID);
                break;
            case 'Crops':
                this._customerService.getCustomerCrops(this.routeID);
                break;
            case 'Destinations':
                this._customerService.getCustomerDestination(this.routeID);
                break;
            case 'Summary':
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.pageSizeSummary,
                    '',
                    '',
                    ''
                );
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.pageSizeSummary,
                    '',
                    '',
                    ''
                );
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.page,
                    this.pageSizeSummary,
                    '',
                    '',
                    ''
                );
                break;
            default:
        }
    }

    //#region Dialogs
    // Farms
    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                // customerFarms: this.customerFarms,
                id: this.routeID,
                isEdit: false,
                status:true,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    openEditFarmDialog(farm): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
                customerFarmData: {
                    name: farm.name,
                    id: farm.id,
                    status:farm.status,
                }
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }
    // Field Dialog
    openAddFieldDialog(): void {
        const dialogRef = this._matDialog.open(AddFieldComponent, {
            data: {
                // customerFarms: this.customerFarms,
                customer_id: this.routeID,
                isEdit: false,
                status:true
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
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
                }
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    // Crop
    openAddCropDialog(): void {
        this.isEdit = false;
        const dialogRef = this._matDialog.open(AddCropComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: this.isEdit,
                status:true
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    //Destination
    openAddDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: this.isEdit,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditDestinationDialog(destination): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                isEdit: this.isEdit,
                customer_id: this.routeID,
                customerDestinationData: {
                    farm_name: destination.farm_name,
                    name: destination.destination_name,
                    calender_year: destination.calendar_year,
                    farm_id: destination.farm_id,
                    destination_id: destination.destination_id,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
   }
    //#endregion

    //#region  Sort Data
    sortData(sort: any) {
        switch (this.activeTab) {
            case 'Farms':
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                break;
            case 'Fields':
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                break;
            case 'Crops':
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                break;
            case 'Destinations':
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                break;
            case 'Summary':
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    this.limit,
                    sort.active,
                    sort.direction,
                    this.searchResult
                );
                break;
            default:
        }
    }
    //#endregion

    pageChanged(event) {
        console.log('Page', event);
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        // for sumary apis's
        this._customerService.getCustomerFarm(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );

        this._customerService.getCustomersummaryFarm(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
        this._customerService.getCustomerSummaryField(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
        this._customerService.getCustomerSummaryDestination(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
    }
}
