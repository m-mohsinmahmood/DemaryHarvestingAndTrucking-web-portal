import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CustomersService } from '../../../customers.service';
import { ActivatedRoute } from '@angular/router';
import { AddCombiningRateComponent } from '../add-combining-rate/add-combining-rate.component';
import { AddHaulingRateComponent } from '../add-hauling-rate/add-hauling-rate.component';
import { AddCommercialTruckingRateComponent } from '../add-commercial-trucking-rate/add-commercial-trucking-rate.component';
import { AddCustomFarmingRateComponent } from '../add-custom-farming-rate/add-custom-farming-rate.component';

@Component({
  selector: 'app-rate-data',
  templateUrl: './rate-data.component.html',
  styleUrls: ['./rate-data.component.scss'],
})
export class RateDataComponent implements OnInit {
    
//#region Search form variables
  searchForm: FormGroup = new FormGroup({
    search: new FormControl(),
  });
  searchCombiningForm: FormGroup = new FormGroup({
    search: new FormControl(),
  });
  searchHaulingForm: FormGroup = new FormGroup({
    search: new FormControl(),
  });
  searchTruckingForm: FormGroup = new FormGroup({
    search: new FormControl(),  
  });
  searchCustomFarmingForm: FormGroup = new FormGroup({
    search: new FormControl(),
  });
//#endregion

//#region Observables
 // Customer Combining Rate Listing
 combiningRateList$: Observable<any[]>;
 isLoadingCombiningRateList$: Observable<boolean>;
 // Customer Combining Rate By ID
 combiningRate$: Observable<any>;
 isLoadingCombiningRate$: Observable<boolean>;

 // Customer Hauling Rate Listing
 haulingRateList$: Observable<any[]>;
 isLoadingHaulingRateList$: Observable<boolean>;
 // Customer Hauling Rate By ID
 haulingRate$: Observable<any>;
 isLoadingHaulingRate$: Observable<boolean>;

 // Customer Trucking Rate Listing
 truckingRateList$: Observable<any[]>;
 isLoadingTruckingRateList$: Observable<boolean>;
 // Customer Trucking Rate By ID
 truckingRate$: Observable<any>;
 isLoadingTruckingRate$: Observable<boolean>;

 // Customer Farming Rate Listing
 farmingRateList$: Observable<any[]>;
 isLoadingFarmingRateList$: Observable<boolean>;
 // Customer Farming Rate By ID
 farmingRate$: Observable<any>;
 isLoadingFarmingRate$: Observable<boolean>;

private _unsubscribeAll: Subject<any> = new Subject<any>();
//#endregion

//#region  local Variables
  search: Subscription;
  searchCombining: Subscription;
  searchHauling: Subscription;
  searchResult: string;
  isEdit: boolean = false;
  pageSize = 10;
  pageSizeSummary = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSizeOptionsSummary: number[] = [5, 25, 50, 100];
  page: number;
  limit: number;
  routeID: any;
  isLoading: any;
  activeTab: any;
  combiningSort: any[] = []
  haulingSort: any[] = []
  truckingSort: any[] = []
  farmingSort: any[] = []

//#endregion

// Constructor
  constructor(
    private _matDialog: MatDialog,
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute
  ) { }
//#region Life Cycle Functions
  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((params) => {
        this.routeID = params.Id;
    });

    // Searching Combining
    this.searchCombining = this.searchCombiningForm.valueChanges
    .pipe(takeUntil(this._unsubscribeAll),
     debounceTime(500))
    .subscribe((data) => {
      this.searchResult = data.search;
      this.page = 1;
      this._customerService.getCombiningRate(
        this.routeID,
        this.page,
        10,
        '',
        '',
        this.searchResult
      );
    });

    // Searching Hauling
    this.searchHauling = this.searchHaulingForm.valueChanges
    .pipe(takeUntil(this._unsubscribeAll),
     debounceTime(500))
    .subscribe((data) => {
      this.searchResult = data.search;
      this.page = 1;
      this._customerService.getHaulingRate(
        this.routeID,
        this.page,
        10,
        '',
        '',
        this.searchResult
      );
    })
    
    // searching in tabs
     this.search = this.searchForm.valueChanges
     .pipe(takeUntil(this._unsubscribeAll),
      debounceTime(500))
     .subscribe((data) => {
         this.searchResult = data.search;
         this.page = 1;
         switch (this.activeTab) {
             case 'Trucking':
                 this._customerService.getTruckingRate(
                     this.routeID,
                     this.page,
                     10,
                     '',
                     '',
                     this.searchResult
                 );
                 break;
             case 'Farming':
                 this._customerService.getFarmingRate(
                     this.routeID,
                     this.page,
                     10,
                     '',
                     '',
                     this.searchResult
                 );
                 break;
             default:
         }
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

  //#region Initialize Observables
  initObservables() {
    this.initCombiningRateObservables();
    this.initHaulingRateObservables();
    this.initTruckingRateObservables();
    this.initFarmingRateObservables();
  }

  initCombiningRateObservables(){
    // Data
    this.combiningRateList$ = this._customerService.combiningRateList$;
    this.combiningRate$ = this._customerService.combiningRate$

    //Loaders
    this.isLoadingCombiningRateList$ = this._customerService.isLoadingCombiningRateList$;
    this.isLoadingCombiningRate$ = this._customerService.isLoadingCombiningRate$
  }
  initHaulingRateObservables() {
    // Data
    this.haulingRateList$ = this._customerService.haulingRateList$;
    this.haulingRate$ = this._customerService.haulingRate$;

    // Loaders
    this.isLoadingHaulingRateList$ = this._customerService.isLoadingHaulingRateList$;
    this.isLoadingCombiningRate$ = this._customerService.isLoadingHaulingRate$
  }
  initTruckingRateObservables(){
    // Data
    this.truckingRateList$ = this._customerService.truckingRateList$;
    this.truckingRate$ = this._customerService.truckingRate$;

    // Loaders
    this.isLoadingTruckingRateList$ = this._customerService.isLoadingTruckingRateList$;
    this.isLoadingTruckingRate$ = this._customerService.isLoadingTruckingRate$
  }
  initFarmingRateObservables() {
    // Data
    this.farmingRateList$ = this._customerService.farmingRateList$;
    this.farmingRate$ = this._customerService.farmingRate$;

    // Loaders
    this.isLoadingFarmingRateList$ = this._customerService.isLoadingFarmingRateList$;
    this.isLoadingFarmingRate$ = this._customerService.isLoadingFarmingRate$
  }
  //#endregion

  //#region Initial APIs
  initApis() {
    this._customerService.getCombiningRate(this.routeID);
    this._customerService.getHaulingRate(this.routeID);
    this._customerService.getTruckingRate(this.routeID);
    this._customerService.getFarmingRate(this.routeID);

    // for sorting
    this.activeTab = 'Hauling';
  }
  //#endregion

  //#region Tab Changed
  rateTabChanged(event): void {
    this.activeTab = event.tab.textLabel;
    this.page = 1;
    switch (event.tab.textLabel) {
        case 'Combining':
            this._customerService.getCombiningRate(this.routeID);
            break;
        case 'Hauling':
            this._customerService.getHaulingRate(this.routeID);
            break;
        case 'Trucking':
            this._customerService.getTruckingRate(this.routeID);
            break;
        case 'Farming':
            this._customerService.getFarmingRate(this.routeID);
            break;
        // case 'Summary':
            // this._customerService.getCustomerFarm(
            //     this.routeID,
            //     this.page,
            //     5,
            // );
            // this._customerService.getCustomerField(
            //     this.routeID,
            //     this.page,
            //     5,
            // );
            // this._customerService.getCustomerCrops(
            //     this.routeID,
            //     this.page,
            //     5,
            // );
            // this._customerService.getCustomerDestination(
            //     this.routeID,
            //     this.page,
            //     5,
            // );
            // break;
        default:
    }
  }

  //#region Add/Edit Dialogues
  openAddCombiningDialog() {
    const dialogRef = this._matDialog.open(AddCombiningRateComponent, {
      data: {
          customer_id: this.routeID,
          isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  openEditCombiningDialog(combiningRate) {
    const dialogRef = this._matDialog.open(AddCombiningRateComponent, {
      data: {
          customer_id: this.routeID,
          isEdit: true,
          combiningRate:combiningRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openAddHaulingDialog() {
    const dialogRef = this._matDialog.open(AddHaulingRateComponent, {
      data: {
          customer_id: this.routeID,
          isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openEditHaulingDialog(haulingRate) {
    const dialogRef = this._matDialog.open(AddHaulingRateComponent, {
      data: {
          customer_id: this.routeID,
          isEdit: true,
          haulingRate: haulingRate,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});

  }
  openAddTruckingDialog() {
    const dialogRef = this._matDialog.open(AddCommercialTruckingRateComponent, {
      data: {
          customerId: this.routeID,
          isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  openEditTruckingDialog(truckingRate) {
    const dialogRef = this._matDialog.open(AddCommercialTruckingRateComponent, {
      data: {
          isEdit: true,
          customerId: this.routeID,
          truckingRate: truckingRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  } 

  openAddFarmingDialog() {
    const dialogRef = this._matDialog.open(AddCustomFarmingRateComponent, {
      data: {
          customerId: this.routeID,
          isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openEditFarmingDialog(farmingRate) {
    const dialogRef = this._matDialog.open(AddCustomFarmingRateComponent, {
      data: {
          isEdit: true,
          customerId: this.routeID,
          farmingRate: farmingRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});

  }
  //#endregion

  //#region Sort Data
  sortData(sort: any , rateData) {
    this.page = 1;
    switch (rateData) {
        case 'Combining':
        this.combiningSort[0] = sort.active; this.combiningSort[1] = sort.direction;
            this._customerService.getCombiningRate(
                this.routeID,
                this.page,
                this.limit,
                this.combiningSort[0],
                this.combiningSort[1],
                this.searchResult
            );
            break;
        case 'Hauling':
            this.haulingSort[0] = sort.active; this.haulingSort[1] = sort.direction;
            this._customerService.getHaulingRate(
                this.routeID,
                this.page,
                this.limit,
                this.haulingSort[0],
                this.haulingSort[1],
                this.searchResult
            );
            break;
        case 'Trucking':
            this.truckingSort[0] = sort.active; this.truckingSort[1] = sort.direction;
            this._customerService.getTruckingRate(
                this.routeID,
                this.page,
                this.limit,
                this.truckingSort[0],
                this.truckingSort[1],
                this.searchResult
            );
            break;
        case 'Farming':
            this.farmingSort[0] = sort.active; this.farmingSort[1] = sort.direction;
            this._customerService.getFarmingRate(
                this.routeID,
                this.page,
                this.limit,
                this.farmingSort[0],
                this.farmingSort[1],
                this.searchResult
            );
            break;
        default:
    }
  }
  //#endregion

  //#region Pagination
  pageChanged(event, rateData) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    switch (rateData){
        case 'Combining':
            this._customerService.getCombiningRate(
                this.routeID,
                this.page,
                this.limit,
                this.combiningSort[0],
                this.combiningSort[1],
                this.searchResult
            );
            break;
        case 'Hauling':
            this._customerService.getHaulingRate(
                this.routeID,
                this.page,
                this.limit,
                this.haulingSort[0],
                this.haulingSort[1],
                this.searchResult
            );
            break;
        case 'Trucking':
            this._customerService.getTruckingRate(
                this.routeID,
                this.page,
                this.limit,
                this.truckingSort[0],
                this.truckingSort[1],
                this.searchResult
            );
            break;
        case 'Farming':
            this._customerService.getFarmingRate(
                this.routeID,
                this.page,
                this.limit,
                this.farmingSort[0],
                this.farmingSort[1],
                this.searchResult
            );
            break;
        case 'summaryCombining':
            this._customerService.getCustomerFarm(
                this.routeID,
                this.page,
                this.limit,
                this.combiningSort[0],
                this.combiningSort[1],
                this.searchResult
            );
        break;
        case 'summaryHauling':
            this._customerService.getCustomerField(
                this.routeID,
                this.page,
                this.limit,
                this.haulingSort[0],
                this.haulingSort[1],
                this.searchResult
            );
        break;
        case 'summaryTrucking':
            this._customerService.getCustomerCrops(
                this.routeID,
                this.page,
                this.limit,
                this.truckingSort[0],
                this.truckingSort[1],
                this.searchResult
            );
        break;
        case 'summaryFarming':
            this._customerService.getCustomerDestination(
                this.routeID,
                this.page,
                this.limit,
                this.farmingSort[0],
                this.farmingSort[1],
                this.searchResult
            );
        break;
        default:
    }

  }

  //#endregion

}
