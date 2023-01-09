import { OnDestroy, AfterViewInit, Component, OnInit } from '@angular/core';
import { CustomersService } from '../../customers.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit, OnDestroy, AfterViewInit {

    //#region Search form variables
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

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //#endregion

    //#region  local Variables
    search: Subscription;
    searchDestination: Subscription;
    isEdit: boolean = false;
    pageSize = 50;
    pageSizeSummary = 5;
    pageSizeSummaryFarm = 5;
    pageSizeSummaryField = 5;
    pageSizeSummaryCrop = 5;
    pageSummaryFarm: number;
    pageSummaryField: number;
    pageSummaryCrop: number;
    pageSummaryDestination: number;
    pageSizeSummaryDestination = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    pageSizeOptionsSummary: number[] = [5, 25, 50, 100];
    page: number;
    limit: number;
    routeID: any;
    isLoading: any;
    activeTab: any;
    searchResultFarm: string;
    searchResultField: string;
    searchResultCrop: string;
    searchResultDestination: string;
    farmSort: any[] = []
    fieldSort: any[] = []
    cropSort: any[] = []
    destinationSort: any[] = []
    fieldFilters: FormGroup;
    destinationFilters: FormGroup;
    cropFilters: FormGroup;
    farmPage: number = 1;
    farmPageSize: number = 10;
    fieldPage: number = 1;
    fieldPageSize: number = 10;
    cropPage: number = 1;
    cropPageSize: number = 10;
    destinationPage: number = 1;
    destinationPageSize: number = 10;
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        private _customerService: CustomersService,
        public activatedRoute: ActivatedRoute
    ) { }

    //#region Life Cycle Functions
    ngOnInit(): void {
        this.initFieldFiltersForm();
        this.initDestinationFiltersForm();
        this.initCropFiltersForm();
        this.activatedRoute.params.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                this.routeID = params.Id;
            });

        // search summary farm
        this.search = this.searchformfarm.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResultFarm = data.search;
                this.page = 1;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.page,
                    this.pageSizeSummaryFarm,
                    '',
                    '',
                    this.searchResultFarm
                );
            });

        // search summary field
        this.search = this.searchformfield.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.page = 1;
                this.searchResultField = data.search;
                this._customerService.getCustomerField(
                    this.routeID,
                    this.page,
                    this.pageSizeSummaryField,
                    '',
                    '',
                    this.searchResultField
                );
            });

        // search summary crop
        this.search = this.searchformcrop.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResultCrop = data.search;
                this.page = 1;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.page,
                    this.pageSizeSummaryCrop,
                    '',
                    '',
                    this.searchResultCrop
                );
            });
        // search summary Destination
        this.search = this.searchformdestination.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResultDestination = data.search;
                this.page = 1;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.page,
                    this.pageSizeSummaryDestination,
                    '',
                    '',
                    this.searchResultDestination
                );
            });
    }

    ngAfterViewInit(): void {
        this.initApis();
        this.initObservables();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Init Field Filters Form
    initFieldFiltersForm() {
        this.fieldFilters = this._formBuilder.group({
            farm_id: [''],
            status: [''],
            calendar_year: [''],
        });
    }
    //#endregion
    //#region Init Destination Filters Form
    initDestinationFiltersForm() {
        this.destinationFilters = this._formBuilder.group({
            farm_id: [''],
            status: [''],
            calendar_year: [''],
        });
    }
    //#endregion

     //#region Init Crop Filters Form
     initCropFiltersForm() {
        this.cropFilters = this._formBuilder.group({
            status: [''],
            calendar_year: [''],
        });
    }
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

    //#region set Farm data page and page size
    setFarmPage(page: any, pageSize: any):void {
        this.farmPageSize = pageSize.farmPageSizeChild;
        this.farmPage = page.farmPageChild;
    }
    setFieldPage(page: any, pageSize: any):void {
        this.fieldPageSize = pageSize.fieldPageSizeChild;
        this.fieldPage = page.fieldPageChild;
    }
    setCropPage(page: any, pageSize: any):void {
        this.cropPageSize = pageSize.cropPageSizeChild;
        this.cropPage = page.cropPageChild;
    }
    setDestinationPage(page: any, pageSize: any):void {
        this.destinationPageSize = pageSize.destinationPageSizeChild;
        this.destinationPage = page.destinationPageChild;
    }

    //#endregion

    //#region Farm Tab Change
    farmTabChange(event) {
        this.activeTab = event.tab.textLabel;
        switch (event.tab.textLabel) {
            case 'Farms':
                this._customerService.getCustomerFarm(this.routeID,this.farmPage,this.farmPageSize,'','','');
                break;
            case 'Fields':
                this._customerService.getCustomerField(this.routeID,this.fieldPage, this.fieldPageSize, '', '', '', this.fieldFilters.value);
                break;
            case 'Crops':
                this._customerService.getCustomerCrops(this.routeID, this.cropPage, this.cropPageSize, '', '', '', this.cropFilters.value);
                break;
            case 'Destinations':
                this._customerService.getCustomerDestination(this.routeID, this.destinationPage, this.destinationPageSize, '', '', '', this.destinationFilters.value);
                break;
            case 'Summary':
                this.searchformfarm.controls['search']?.setValue('');
                this.searchformfield.controls['search']?.setValue('');
                this.searchformcrop.controls['search']?.setValue('');
                this.searchformdestination.controls['search']?.setValue('');
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.pageSummaryFarm,
                    this.pageSizeSummaryFarm,
                );
                this._customerService.getCustomerField(
                    this.routeID,
                    this.pageSummaryField,
                    this.pageSizeSummaryField,
                );
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.pageSummaryCrop,
                    this.pageSizeSummaryCrop,
                );
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.pageSummaryDestination,
                    this.pageSizeSummaryDestination,
                );
                break;
            default:
        }
    }

    //#endregion
    //#region Summary Sort
    sortSummaryData(sort: any, summaryData) {
        switch (summaryData) {
            case 'summaryFarm':
                this.farmSort[0] = sort.active; this.farmSort[1] = sort.direction;
                this.pageSummaryFarm = 1;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.pageSummaryFarm,
                    this.pageSizeSummaryFarm,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResultFarm
                );
                break;
            case 'summaryField':
                this.fieldSort[0] = sort.active; this.fieldSort[1] = sort.direction;
                this.pageSummaryField = 1;
                this._customerService.getCustomerField(
                    this.routeID,
                    this.pageSummaryField,
                    this.pageSizeSummaryField,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResultField
                );
                break;
            case 'summaryCrop':
                this.cropSort[0] = sort.active; this.cropSort[1] = sort.direction;
                this.pageSummaryCrop = 1;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.pageSummaryCrop,
                    this.pageSizeSummaryCrop,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResultCrop
                );
                break;
            case 'summaryDestination':
                this.destinationSort[0] = sort.active; this.destinationSort[1] = sort.direction;
                this.pageSummaryDestination = 1;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.pageSummaryDestination,
                    this.pageSizeSummaryDestination,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResultDestination
                );
                break;
            default:
        }
    }
    //#endregion

    //#region Pagination
    pageChanged(event, farmData) {
        this.page = event.pageIndex + 1;
        switch (farmData) {
            case 'summaryFarm':
                this.pageSizeSummaryFarm = event.pageSize;
                this.pageSummaryFarm = event.pageIndex + 1;
                this._customerService.getCustomerFarm(
                    this.routeID,
                    this.pageSummaryFarm,
                    this.pageSizeSummaryFarm,
                    this.farmSort[0],
                    this.farmSort[1],
                    this.searchResultFarm
                );
                break;
            case 'summaryField':
                this.pageSizeSummaryField = event.pageSize;
                this.pageSummaryField = event.pageIndex + 1;
                this._customerService.getCustomerField(
                    this.routeID,
                    this.pageSummaryField,
                    this.pageSizeSummaryField,
                    this.fieldSort[0],
                    this.fieldSort[1],
                    this.searchResultField
                );
                break;
            case 'summaryCrop':
                this.pageSizeSummaryCrop = event.pageSize;
                this.pageSummaryCrop = event.pageIndex + 1;
                this._customerService.getCustomerCrops(
                    this.routeID,
                    this.pageSummaryCrop,
                    this.pageSizeSummaryCrop,
                    this.cropSort[0],
                    this.cropSort[1],
                    this.searchResultCrop
                );
                break;
            case 'summaryDestination':
                this.pageSizeSummaryDestination = event.pageSize;
                this.pageSummaryDestination = event.pageIndex + 1;
                this._customerService.getCustomerDestination(
                    this.routeID,
                    this.pageSummaryDestination,
                    this.pageSizeSummaryDestination,
                    this.destinationSort[0],
                    this.destinationSort[1],
                    this.searchResultDestination
                );
                break;
            default:
        }
    }
    //#endregion

}
