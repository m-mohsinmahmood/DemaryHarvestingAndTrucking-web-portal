import { OnDestroy, AfterViewInit } from '@angular/core';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../customers.service';
import { AddFarmComponent } from '../farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AddRealFarmComponent } from './add-real-farm/add-farm.component';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit, OnDestroy, AfterViewInit {
    searchform: FormGroup = new FormGroup({
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
    pageSize2 = 5;
    currentPage = 0;
    currentPage2 = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    pageSizeOptions2: number[] = [5, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;
    routeID: any;
    isLoading: any;
    customerCrops$: Observable<any>;
    customerCrop: any;

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

        // this.customerCrops$ = this._customersService.customerCrops$;

        // // calling summary observables
        // this.summaryfarms$ = this._customersService.customerSummaryFarms$;
        // this.summaryfields$ =  this._customersService.customerSummaryFields$;
        // this.summarydestinations$ = this._customersService.customerSummaryDestination$;
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
    }
    //#endregion
    //#region Add/Edit Dialogues

    farmTabChange(event) {
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
            default:
        }
    }
    // Farm
    openAddRealFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddRealFarmComponent, {
            data: {
                // customerFarms: this.customerFarms,
                id: this.routeID,
                isEdit: false,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditRealFarmDialog(customerFarm): void {
        console.log(event);
        const dialogRef = this._matDialog.open(AddRealFarmComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
                name: customerFarm.name,
                id: customerFarm.id,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    //Field
    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                // customerFarms: this.customerFarms,
                id: this.routeID,
                isEdit: false,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditFarmDialog(field): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                isEdit: true,
                customer_id: this.routeID,
                field_name: field.field_name,
                field_id: field.field_id,
                farm_name: field.farm_name,
                farm_id: field.farm_id,
                acres: field.acres,
                calendar_year: field.calendar_year,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    // Crop
    openAddCropDialog(): void {
        this.isEdit = false;
        const dialogRef = this._matDialog.open(AddCropComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: this.isEdit,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    //Destination
    openAddDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                customer_id: this.routeID,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditDestinationDialog(customerDestination): void {
        console.log('Edit data:', customerDestination);
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                farmdata: {
                    isEdit: this.isEdit,
                    farmName: customerDestination.farm_name,
                    name: customerDestination.destination_name,
                    calenderYear: customerDestination.calendar_year,
                    farmId: customerDestination.farm_id,
                    customer_id: this.routeID,
                    destination_id: customerDestination.destination_id,
                },
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    //#endregion

    sortData(sort: any) {
        this._customerService.getCustomerField(
            this.routeID,
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }
    sortData2(sort: any) {
        console.log('Sort:', sort);
        this._customerService.getCustomerDestination(
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
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        this._customerService.getCustomerDestination(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
        this._customerService.getCustomerCrops(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
        this._customerService.getCustomerField(
            this.routeID,
            page,
            limit,
            '',
            '',
            this.searchResult
        );

        // for sumary apis's
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
