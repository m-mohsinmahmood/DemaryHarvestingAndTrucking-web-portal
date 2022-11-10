import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CustomersService } from '../../../customers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rate-data',
  templateUrl: './rate-data.component.html',
  styleUrls: ['./rate-data.component.scss'],
})
export class RateDataComponent implements OnInit {

  //#region Input
  @Input() customer: Observable<any>
  //#endregion

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
  pageSizeOptionsSummary: number[] = [5, 10, 25, 50, 100];
  page: number;
  limit: number;
  routeID: any;
  isLoading: any;
  activeTab: any;
  combiningSort: any[] = []
  haulingSort: any[] = []
  truckingSort: any[] = []
  farmingSort: any[] = []
  customerTypes: any[] = []
  //#endregion

  // Constructor
  constructor(
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
              '',
              '',
              this.searchResult
            );
            break;
          case 'Farming':
            this._customerService.getFarmingRate(
              this.routeID,
              '',
              '',
              this.searchResult
            );
            break;
          default:
        }
      });
  }

  ngOnChanges(changes){
    if(changes.customer){
      this.customerTypes = changes.customer.currentValue.customer_type.split(',')
    }
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

  initCombiningRateObservables() {
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
  initTruckingRateObservables() {
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
      case 'Commercial Trucking':
        this._customerService.getTruckingRate(this.routeID);
        break;
      case 'Custom Farming':
        this._customerService.getFarmingRate(this.routeID);
        break;
      case 'Summary':
        this._customerService.getCombiningRate(
          this.routeID,
        );
        this._customerService.getHaulingRate(
          this.routeID,
        );
        this._customerService.getTruckingRate(
          this.routeID,
        );
        this._customerService.getFarmingRate(
          this.routeID,
        );
        break;
      default:
    }
  }

  //#region Sort Data
  sortData(sort: any, rateData) {
    this.page = 1;
    switch (rateData) {
      case 'Combining':
        this.combiningSort[0] = sort.active; this.combiningSort[1] = sort.direction;
        this._customerService.getCombiningRate(
          this.routeID,
          this.combiningSort[0],
          this.combiningSort[1],
          this.searchResult
        );
        break;
      case 'Hauling':
        this.haulingSort[0] = sort.active; this.haulingSort[1] = sort.direction;
        this._customerService.getHaulingRate(
          this.routeID,
          this.haulingSort[0],
          this.haulingSort[1],
          this.searchResult
        );
        break;
      case 'Trucking':
        this.truckingSort[0] = sort.active; this.truckingSort[1] = sort.direction;
        this._customerService.getTruckingRate(
          this.routeID,
          this.truckingSort[0],
          this.truckingSort[1],
          this.searchResult
        );
        break;
      case 'Farming':
        this.farmingSort[0] = sort.active; this.farmingSort[1] = sort.direction;
        this._customerService.getFarmingRate(
          this.routeID,
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
