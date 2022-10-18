import { OnDestroy, AfterViewInit,Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../customers.service';
import { AddFieldComponent } from './add-field/add-field.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AddFarmComponent } from './add-farm/add-farm.component';
@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit, OnDestroy, AfterViewInit {

    //#region Search form variables
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
    searchformdestination: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    //#endregion

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

     // Summary
     summaryfarms$: Observable<any>;
     summaryfields$: Observable<any>;
     summarydestinations$: Observable<any>;

    //#endregion

    //#region  local Variables
    search: Subscription;
    searchDestination: Subscription;
    isEdit: boolean = false;
    pageSize = 10;
    pageSizeSummary = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    pageSizeOptionsSummary: number[] = [5, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;
    routeID: any;
    isLoading: any;
    activeTab: any;
    farmSort: any[] = []
    fieldSort: any[] = []
    cropSort: any[] = []
    destinationSort: any[] = []

    //#endregion

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
                            10,
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
         // search summary Destination
         this.search = this.searchformdestination.valueChanges
         .pipe(debounceTime(500))
         .subscribe((data) => {
             this.searchResult = data.search;
             this._customerService.getCustomerDestination(
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
                    1,
                    5,
                );
                this._customerService.getCustomerField(
                    this.routeID,
                    1,
                    5,
                );
                this._customerService.getCustomerCrops(
                    this.routeID,
                    1,
                    5,
                );
                this._customerService.getCustomerDestination(
                    this.routeID,
                    1,
                    5,
                );
                break;
            default:
        }
    }

    //#region Add/Edit Dialogues
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
                status: true
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    openEditCropDialog(crop): void{
        this.isEdit =  true;
        const dialogRef = this._matDialog.open(AddCropComponent, {
            data: {
                customer_id: this.routeID,
                isEdit: this.isEdit,
                customerCropData:{
                    id: crop.customer_crop_id,
                    crop_id: crop.crop_id,
                    crop_name: crop.crop_name,
                    calendar_year: crop.calendar_year
                }
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
        });

    }

    //Destination
    openAddDestinationDialog(): void {
        this.isEdit = false;
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
        console.log('Destination Object:',destination);
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                isEdit: this.isEdit,
                customer_id: this.routeID,
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
        });
   }
    //#endregion

    //#region  Sort Data
    sortData(sort: any) {
        switch (this.activeTab) {
            case 'Farms':
            this.farmSort[0] = sort.active; this.farmSort[1] = sort.direction;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    1,
                    this.limit,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
                break;
            case 'Fields':
                this.fieldSort[0] = sort.active; this.fieldSort[1] = sort.direction;
                this._customerService.getCustomerField(
                    this.routeID,
                    1,
                    this.limit,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult
                );
                break;
            case 'Crops':
                this.cropSort[0] = sort.active; this.cropSort[1] = sort.direction;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    1,
                    this.limit,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResult
                );
                break;
            case 'Destinations':
                this.destinationSort[0] = sort.active; this.destinationSort[1] = sort.direction;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    1,
                    this.limit,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult
                );
                break;
            default:
        }
    }

    sortSummaryData(sort: any , summaryData) {
        switch (summaryData) {
            case 'summaryFarm':
                this.farmSort[0] = sort.active; this.farmSort[1] = sort.direction;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    1,
                    5,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
                break;
            case 'summaryField':
                this.fieldSort[0] = sort.active; this.fieldSort[1] = sort.direction;
                this._customerService.getCustomerField(
                    this.routeID,
                    1,
                    this.limit,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult
                );
            break;
            case 'summaryCrop':
                this.cropSort[0] = sort.active; this.cropSort[1] = sort.direction;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    1,
                    this.limit,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResult
                );
            break;
            case 'summaryDestination':
                this.destinationSort[0] = sort.active; this.destinationSort[1] = sort.direction;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    1,
                    this.limit,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult
                );
            break;
        default:
        }
    }
    //#endregion

    //#region Pagination
    pageChanged(event, farmData) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        switch (farmData){
            case 'Farm':
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
                break;
            case 'Field':
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult
                );
                break;
            case 'Crop':
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResult
                );
                break;
            case 'Destination':
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult
                );
                break;
            case 'summaryFarm':
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResult
                );
            break;
            case 'summaryField':
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResult
                );
            break;
            case 'summaryCrop':
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResult
                );
            break;
            case 'summaryDestination':
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    this.limit,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResult
                );
            break;
            default:
        }
    }
    //#endregion

    getNextData(page, limit) {
        // this._customerService.getCustomerSummaryFarm(
        //     this.routeID,
        //     page,
        //     limit,
        //     '',
        //     '',
        //     this.searchResult
        // );
        // this._customerService.getCustomerSummaryField(
        //     this.routeID,
        //     page,
        //     limit,
        //     '',
        //     '',
        //     this.searchResult
        // );
        // this._customerService.getCustomerSummaryDestination(
        //     this.routeID,
        //     page,
        //     limit,
        //     '',
        //     '',
        //     this.searchResult
        // );
    }
}
