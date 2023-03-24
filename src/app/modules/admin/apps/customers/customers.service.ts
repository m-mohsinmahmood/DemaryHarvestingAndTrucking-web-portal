import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { AlertService } from 'app/core/alert/alert.service';
import {
    Customers,
    CustomerContacts,
    CustomerField,
    CustomerFarm,
    Documents,
    Item,
    customerFilters,
    fieldFilters,
    cropFilters,
    destinationFilters
} from 'app/modules/admin/apps/customers/customers.types';
import { customerNavigation } from './customerNavigation';
import { Router } from '@angular/router';
import { harvestingJobsFilters } from 'app/modules/admin/apps/customers/customers.types';
@Injectable({
    providedIn: 'root',
})
export class CustomersService {
    public navigationLabels = customerNavigation;
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();

    //#region Loaders Customers
    private isLoadingCustomers: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomers$: Observable<boolean> =
        this.isLoadingCustomers.asObservable();

    isLoadingCustomer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    readonly isLoadingCustomer$: Observable<boolean> =
        this.isLoadingCustomer.asObservable();
    //#endregion

    //#region Observables Customer
    private customers: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customers$: Observable<Customers[] | null> =
        this.customers.asObservable();

    private customer: BehaviorSubject<Customers | null> = new BehaviorSubject(
        null
    );
    readonly customer$: Observable<Customers | null> =
        this.customer.asObservable();

    private customerExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerExport$: Observable<Customers | null> = this.customerExport.asObservable();
    //#endregion

    //#region Observables Customer Contact

    // Data
    private customerContactList: BehaviorSubject<CustomerContacts[] | null> =
        new BehaviorSubject(null);
    readonly customerContactList$: Observable<CustomerContacts[] | null> =
        this.customerContactList.asObservable();

    private customerContact: BehaviorSubject<CustomerContacts | null> =
        new BehaviorSubject(null);
    readonly customerContact$: Observable<CustomerContacts | null> =
        this.customerContact.asObservable();

    private customerContactExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerContactExport$: Observable<Customers | null> = this.customerContactExport.asObservable();

    // Loaders
    private isLoadingCustomerContactList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContactList$: Observable<boolean> =
        this.isLoadingCustomerContactList.asObservable();

    isLoadingCustomerContact: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContact$: Observable<boolean> =
        this.isLoadingCustomerContact.asObservable();

    //#endregion

    //#region Observables Customer Farm
    // Data
    private customerFarmList: BehaviorSubject<CustomerFarm[] | null> =
        new BehaviorSubject(null);
    readonly customerFarmList$: Observable<CustomerFarm[] | null> =
        this.customerFarmList.asObservable();

    private customerFarm: BehaviorSubject<CustomerFarm | null> =
        new BehaviorSubject(null);
    readonly customerFarm$: Observable<CustomerFarm | null> =
        this.customerFarm.asObservable();

    private customerFarmExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerFarmExport$: Observable<Customers | null> = this.customerFarmExport.asObservable();
    // Loaders
    private isLoadingCustomerFarmList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerFarmList$: Observable<boolean> =
        this.isLoadingCustomerFarmList.asObservable();

    isLoadingCustomerFarm: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerFarm$: Observable<boolean> =
        this.isLoadingCustomerFarm.asObservable();
    //#endregion

    //#region Observables Customer Field
    // Data
    private customerFieldList: BehaviorSubject<CustomerField[] | null> =
        new BehaviorSubject(null);
    readonly customerFieldList$: Observable<CustomerField[] | null> =
        this.customerFieldList.asObservable();

    private customerField: BehaviorSubject<CustomerField | null> =
        new BehaviorSubject(null);
    readonly customerField$: Observable<CustomerField | null> =
        this.customerField.asObservable();

    private customerFieldExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerFieldExport$: Observable<Customers | null> = this.customerFieldExport.asObservable();

    // Loaders
    private isLoadingCustomerFieldList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerFieldList$: Observable<boolean> =
        this.isLoadingCustomerFieldList.asObservable();

    isLoadingCustomerField: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerField$: Observable<boolean> =
        this.isLoadingCustomerField.asObservable();
    //#endregion

    //#region Observables Customer Crop
    // Data
    private customerCropList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly customerCropList$: Observable<any[] | null> =
        this.customerCropList.asObservable();

    private customerCrop: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    readonly customerCrop$: Observable<any[] | null> =
        this.customerCrop.asObservable();

    private customerCropExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerCropExport$: Observable<Customers | null> = this.customerCropExport.asObservable();

    // Loaders
    private isLoadingCustomerCropList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerCropList$: Observable<boolean> =
        this.isLoadingCustomerCropList.asObservable();

    isLoadingCustomerCrop: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerCrop$: Observable<boolean> =
        this.isLoadingCustomerCrop.asObservable();
    //#endregion

    //#region Observables Customer Destination
    // Data
    private customerDestinationList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly customerDestinationList$: Observable<any[] | null> =
        this.customerDestinationList.asObservable();

    private customerDestination: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly customerDestination$: Observable<any[] | null> =
        this.customerDestination.asObservable();

    private customerDestinationExport: BehaviorSubject<Customers | null> = new BehaviorSubject(null);
    readonly customerDestinationExport$: Observable<Customers | null> = this.customerDestinationExport.asObservable();

    // Loaders
    private isLoadingCustomerDestinationList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerDestinationList$: Observable<boolean> =
        this.isLoadingCustomerDestinationList.asObservable();

    isLoadingCustomerDestination: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomerDestination$: Observable<boolean> =
        this.isLoadingCustomerDestination.asObservable();
    //#endregion

    //#region Observables Combining Rate
    // Data
    private combiningRateList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly combiningRateList$: Observable<any[] | null> =
        this.combiningRateList.asObservable();

    private combiningRate: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly combiningRate$: Observable<any[] | null> =
        this.combiningRate.asObservable();

    // Loaders
    private isLoadingCombiningRateList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCombiningRateList$: Observable<boolean> =
        this.isLoadingCombiningRateList.asObservable();

    isLoadingCombiningRate: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCombiningRate$: Observable<boolean> =
        this.isLoadingCombiningRate.asObservable();
    //#endregion

    //#region Observables Hauling Rate
    // Data
    private haulingRateList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly haulingRateList$: Observable<any[] | null> =
        this.haulingRateList.asObservable();

    private haulingRate: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly haulingRate$: Observable<any[] | null> =
        this.haulingRate.asObservable();

    // Loaders
    private isLoadingHaulingRateList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingHaulingRateList$: Observable<boolean> =
        this.isLoadingHaulingRateList.asObservable();

    isLoadingHaulingRate: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingHaulingRate$: Observable<boolean> =
        this.isLoadingHaulingRate.asObservable();
    //#endregion

    //#region Observables Trucking Rate
    // Data
    private truckingRateList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly truckingRateList$: Observable<any[] | null> =
        this.truckingRateList.asObservable();

    private truckingRate: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly truckingRate$: Observable<any[] | null> =
        this.truckingRate.asObservable();

    // Loaders
    private isLoadingTruckingRateList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingTruckingRateList$: Observable<boolean> =
        this.isLoadingTruckingRateList.asObservable();

    isLoadingTruckingRate: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingTruckingRate$: Observable<boolean> =
        this.isLoadingTruckingRate.asObservable();
    //#endregion

    //#region Observables Farming Rate
    // Data
    private farmingRateList: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly farmingRateList$: Observable<any[] | null> =
        this.farmingRateList.asObservable();

    private farmingRate: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly farmingRate$: Observable<any[] | null> =
        this.farmingRate.asObservable();

    // Loaders
    private isLoadingFarmingRateList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingFarmingRateList$: Observable<boolean> =
        this.isLoadingFarmingRateList.asObservable();

    isLoadingFarmingRate: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingFarmingRate$: Observable<boolean> =
        this.isLoadingFarmingRate.asObservable();
    //#endregion

    //#region Observables Customer Farming Jobs
    customFarmingJobs: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customFarmingJobs$: Observable<Customers[] | null> =
        this.customFarmingJobs.asObservable();
    //#endregion

    // Loaders
    private isLoadingFarmingJobs: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingFarmingJobs$: Observable<boolean> =
        this.isLoadingFarmingJobs.asObservable();


    //#region Observables Customer Trucking Jobs
    commercialTruckingJobs: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly commercialTruckingJobs$: Observable<Customers[] | null> =
        this.commercialTruckingJobs.asObservable();
    //#endregion

    // Loaders
    private isLoadingTruckingJobs: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingTruckingJobs$: Observable<boolean> =
        this.isLoadingTruckingJobs.asObservable();


    //#region Observables Customer Harvesting Jobs
    customHarvestingJobs: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customHarvestingJobs$: Observable<Customers[] | null> =
        this.customHarvestingJobs.asObservable();
    //#endregion

    // Loaders
    private isLoadingHarvestingJobs: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingHarvestingJobs$: Observable<boolean> =
        this.isLoadingHarvestingJobs.asObservable();



    //#region Observables Customer Farming Invoicing
    farmingInvoices: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly farmingInvoices$: Observable<Customers[] | null> =
        this.farmingInvoices.asObservable();
    //#endregion

    // Loaders
    private isLoadingFarmingInvoices: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingFarmingInvoices$: Observable<boolean> =
        this.isLoadingFarmingInvoices.asObservable();



    //#region Observables Customer Trucking Invoicing
    truckingInvoices: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly truckingInvoices$: Observable<Customers[] | null> =
        this.truckingInvoices.asObservable();
    //#endregion

    // Loaders
    private isLoadingTruckingInvoices: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingTruckingInvoices$: Observable<boolean> =
        this.isLoadingTruckingInvoices.asObservable();

    //#region Observables Customer Trucking Invoicing
    rentalInvoices: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly rentalInvoices$: Observable<Customers[] | null> =
        this.rentalInvoices.asObservable();
    //#endregion

    // Loaders
    private isLoadingRentalInvoices: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingRentalInvoices$: Observable<boolean> =
        this.isLoadingRentalInvoices.asObservable();


    //#region Observables Customer Harvesting Invoicing
    harvestingInvoices: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly harvestingInvoices$: Observable<Customers[] | null> =
        this.harvestingInvoices.asObservable();
    //#endregion

    // Loaders
    private isLoadingHarvestingInvoices: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingHarvestingInvoices$: Observable<boolean> =
        this.isLoadingHarvestingInvoices.asObservable();


    //#region Observables Customer Harvesting List
    customHarvestingInvoiceList: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customHarvestingInvoiceList$: Observable<Customers[] | null> =
        this.customHarvestingInvoiceList.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomHarvestingInvoiceList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomHarvestingInvoiceList$: Observable<boolean> =
        this.isLoadingCustomHarvestingInvoiceList.asObservable();

    //#region Observables Customer Harvesting List
    customFarmingInvoiceList: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customFarmingInvoiceList$: Observable<Customers[] | null> =
        this.customFarmingInvoiceList.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomFarmingInvoiceList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomFarmingInvoiceList$: Observable<boolean> =
        this.isLoadingCustomFarmingInvoiceList.asObservable();

    //#region Observables Customer Harvesting List
    customTruckingInvoiceList: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customTruckingInvoiceList$: Observable<Customers[] | null> =
        this.customTruckingInvoiceList.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomTruckingInvoiceList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomTruckingInvoiceList$: Observable<boolean> =
        this.isLoadingCustomTruckingInvoiceList.asObservable();


    //#region Observables Customer Harvesting List
    customRentalnvoiceList: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customRentalnvoiceList$: Observable<Customers[] | null> =
        this.customRentalnvoiceList.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomRentalInvoiceList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomRentalInvoiceList$: Observable<boolean> =
        this.isLoadingCustomRentalInvoiceList.asObservable();


    //#region Observables Customer Harvesting Invoicing
    customHarvestingInvoice: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customHarvestingInvoice$: Observable<Customers[] | null> =
        this.customHarvestingInvoice.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomHarvestingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomHarvestingInvoice$: Observable<boolean> =
        this.isLoadingCustomHarvestingInvoice.asObservable();

    isLoadingCreateFarmingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCreateFarmingInvoice$: Observable<boolean> =
        this.isLoadingCreateFarmingInvoice.asObservable();

    //#region Observables Customer Rental Invoicing
    customRentalInvoice: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly customRentalInvoice$: Observable<Customers[] | null> =
        this.customRentalInvoice.asObservable();
    //#endregion

    // Loaders
    isLoadingCustomRentalInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingCustomRentalInvoice$: Observable<boolean> =
        this.isLoadingCustomRentalInvoice.asObservable();


    //#region Observables Customer Rental Invoicing
    jobResultsFarmingInvoice: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly jobResultsFarmingInvoice$: Observable<Customers[] | null> =
        this.jobResultsFarmingInvoice.asObservable();
    //#endregion

    // Loaders
    isLoadingJobResultsFarmingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingJobResultsFarmingInvoice$: Observable<boolean> =
        this.isLoadingJobResultsFarmingInvoice.asObservable();


    //#region Observables Customer Rental Invoicing
    payFarmingInvoiceOb: BehaviorSubject<Customers[] | null> =
        new BehaviorSubject(null);
    readonly payFarmingInvoiceOb$: Observable<Customers[] | null> =
        this.payFarmingInvoiceOb.asObservable();
    //#endregion

    // Loaders
    isLoadingPayFarmingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingPayFarmingInvoice$: Observable<boolean> =
        this.isLoadingPayFarmingInvoice.asObservable();

    // Loaders
    isLoadingEditTruckingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingEditTruckingInvoice$: Observable<boolean> =
        this.isLoadingEditTruckingInvoice.asObservable();

    isLoadingEditFarmingInvoice: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingEditFarmingInvoice$: Observable<boolean> =
        this.isLoadingEditFarmingInvoice.asObservable();



    //#region Observables Dropdowns
    // Data
    // private dropdownCustomerCrops: BehaviorSubject<any[] | null> =
    //     new BehaviorSubject(null);
    // readonly dropdownCustomerCrops$: Observable<any[] | null> =
    //     this.dropdownCustomerCrops.asObservable();

    // private dropdownCustomerFarms: BehaviorSubject<any[] | null> =
    //     new BehaviorSubject(null);
    // readonly dropdownCustomerFarms$: Observable<any[] | null> =
    //     this.dropdownCustomerFarms.asObservable();

    // private dropdownCustomerCropsAll: BehaviorSubject<any[] | null> =
    //     new BehaviorSubject(null);
    // readonly dropdownCustomerCropsAll$: Observable<any[] | null> =
    //     this.dropdownCustomerCropsAll.asObservable();

    // // Loaders
    // private isLoadingDropdownCustomerCrops: BehaviorSubject<boolean> =
    //     new BehaviorSubject<boolean>(false);
    // readonly isLoadingDropdownCustomerCrops$: Observable<boolean> =
    //     this.isLoadingDropdownCustomerCrops.asObservable();

    // private isLoadingDropdownCustomerFarms: BehaviorSubject<boolean> =
    //     new BehaviorSubject(false);
    // readonly isLoadingDropdownCustomerFarms$: Observable<boolean> =
    //     this.isLoadingDropdownCustomerFarms.asObservable();

    // private isLoadingDropdownCustomerCropsAll: BehaviorSubject<boolean> =
    //     new BehaviorSubject(false);
    // readonly isLoadingDropdownCustomerCropsAll$: Observable<boolean> =
    //     this.isLoadingDropdownCustomerCropsAll.asObservable();
    //#endregion

    //#region Behaviour Subject
    private _documents: BehaviorSubject<Documents | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    //#endregion

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService,
        private _router: Router,

    ) { }

    get documents$(): Observable<Documents> {
        return this._documents.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    //#region Error Function
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
            this._alertSerice.showAlert({
                type: 'error',
                shake: false,
                slideRight: true,
                title: 'Error',
                message: error.error.message,
                time: 6000,
            });
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            this._alertSerice.showAlert({
                type: 'error',
                shake: false,
                slideRight: true,
                title: 'Error',
                message: error.error.message,
                time: 6000,
            });
        }
        return throwError(errorMessage);
    }

    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    //#region Drop down API's
    getDropdownCustomerCrops(customerId: string, search: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('search', search);
        return this._httpClient
            .get<any>(`api-1/dropdowns?entity=customerCrops&customerId=${customerId}`, { params })
            .pipe(take(1))
    }

    getDropdownCustomerFarms(customerId: string, search: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('search', search);
        return this._httpClient
            .get<any>(`api-1/dropdowns?entity=customerFarms&customerId=${customerId}`, { params })
            .pipe(take(1))
    }

    getDropdownCustomerCropsAll(search: string = ''): Observable<any> {
        let params = new HttpParams();
        params = params.set('search', search);
        return this._httpClient
            .get<any>(`api-1/dropdowns?entity=allCrops`, { params })
            .pipe(take(1))
    }

    //#endregion


    /**
     * Get Customers
     *
     *
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @param search
     */

    //#region Customer API
    getCustomers(
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: customerFilters = { type: '', status: '' },
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('type', filters.type);
        params = params.set('status', filters.status)
        return this._httpClient
            .get<any>('api-1/customers', {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomers.next(true);
                    this.customers.next(res);
                    this.isLoadingCustomers.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getCustomerById(id: string) {
        this._httpClient
            .get(`api-1/customers?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomer.next(true);
                    this.customer.next(res);
                    this.isLoadingCustomer.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createCustomer(data: any, filters: customerFilters) {
        this._httpClient
            .post(`api-1/customers`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomer.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomer.next(false);
                },
                () => {
                    this.getCustomers(1, 50, '', '', '', filters);
                }
            );
    }

    updateCustomer(customerData: any, paginatioData: any) {
        this._httpClient
            .put(`api-1/customers`, customerData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomer.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomer.next(false);
                },
                () => {
                    this.getCustomerById(customerData.id);
                }
            );
    }
    deleteCustomer(id: any) {
        this._httpClient
            .delete(`api-1/customers?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomer.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {

                },
                () => {
                    this._router.navigate(['/apps/customers']);
                    this.isLoadingCustomer.next(false);

                }
            );
    }

    getCustomerExport(
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: customerFilters = { type: '', status: '' },) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('type', filters.type);
        params = params.set('status', filters.status)
        return this._httpClient
            .get<any>('api-2/customer', { params })
            .pipe(take(1))
    }

    customerImport(
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '', filters: customerFilters) {
        this._httpClient
            .post(`api-2/customer`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomers.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomers.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomers(1, limit, sort, order, search, filters);
                }
            );
    }

    //#endregion
    //#region Customer Contact API
    getCustomerContact(
        id: string,
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-contact?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerContactList.next(true);
                    this.customerContactList.next(res);
                    this.isLoadingCustomerContactList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getCustomerContactById(id: string) {
        this._httpClient
            .get(`api-1/customer-contact?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerContact.next(true);
                    this.customerContact.next(res.crops);
                    this.isLoadingCustomerContact.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createCustomerContact(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        this._httpClient
            .post(`api-1/customer-contact`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerContact.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerContact.next(false);
                },
                () => {
                    this.getCustomerContact(data.customer_id, 1, limit, sort, order, search);
                }
            );
    }

    updateCustomerContact(customerContactData: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        this._httpClient
            .put(`api-1/customer-contact`, customerContactData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerContact.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerContact(
                        customerContactData.customer_id, 1, limit, sort, order, search
                    );
                }
            );
    }

    deleteCustomerContact(id: string,
        customerID: string,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        this._httpClient
            .delete(`api-1/customer-contact?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerContact.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCustomerContact(customerID, 1, limit, sort, order, search);
                    this.isLoadingCustomerContact.next(false);
                }
            );
    }
    getCustomerContactExport(
        customerID: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-2/customer-contact?customerId=${customerID}`, { params })
            .pipe(take(1))
    }

    customerContactImport(
        customerID: string,
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .post(`api-2/customer-contact?customerId=${customerID}`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerContactList.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomerContactList.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerContact(customerID, 1, limit, sort, order, search);
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Farm API
    getCustomerFarm(
        customerId: string,
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-farm?customerId=${customerId}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerFarmList.next(true);
                    this.customerFarmList.next(res);
                    this.isLoadingCustomerFarmList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    getCustomerFarmsAll(
        customerId: string,
        search: string = ''
    ): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', 0);
        params = params.set('limit', 1000);
        params = params.set('search', search);
        params = params.set('sort', 'name');
        params = params.set('order', 'asc');
        return this._httpClient.get<any>(
            `api-1/customer-farm?customerId=${customerId}`,
            {
                params,
            }
        );
    }
    getCustomerFarmById(id: string) {
        this._httpClient
            .get(`api-1/customer-farm?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerFarm.next(true);
                    this.customerFarm.next(res.crops);
                    this.isLoadingCustomerFarm.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    createCustomerFarm(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        this._httpClient
            .post(`api-1/customer-farm`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerFarm.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerFarm.next(false);
                },
                () => {
                    this.getCustomerFarm(data.customer_id, 1, limit, sort, order, search);
                }
            );
    }
    updateCustomerFarm(customerFarmData: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        this._httpClient
            .put(`api-1/customer-farm`, customerFarmData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerFarm.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerFarm.next(false);
                },
                () => {
                    this.getCustomerFarm(
                        customerFarmData.customer_id, 1, limit, sort, order, search
                    );
                }
            );
    }
    deleteCustomerFarm(id: string,
        customerID: string,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        this._httpClient
            .delete(`api-1/customer-farm?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerFarm.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCustomerFarm(customerID, 1, limit, sort, order, search);
                    this.isLoadingCustomerFarm.next(false);
                }
            );
    }
    getCustomerFarmExport(
        customerID: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-2/customer-farm?customerId=${customerID}`, { params })
            .pipe(take(1))
    }
    customerFarmImport(
        customerID: string,
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .post(`api-2/customer-farm?customerId=${customerID}`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerFarmList.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomerFarmList.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerFarm(customerID, 1, limit, sort, order, search);
                }
            );
    }


    //#endregion
    //#region Customer Farm Data Field API
    getCustomerField(
        customer_id: string,
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters = { farm_id: '', status: '', calendar_year: '' },
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('farmId', filters.farm_id);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-1/customer-field?customerId=${customer_id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerFieldList.next(true);
                    this.customerFieldList.next(res);
                    this.isLoadingCustomerFieldList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getCustomerFieldById(id: string) {
        this._httpClient
            .get(`api-1/customer-field?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerField.next(true);
                    this.customerField.next(res.crops);
                    this.isLoadingCustomerField.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createCustomerField(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters) {
        this._httpClient
            .post(`api-1/customer-field`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerField.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerField.next(false);
                },
                () => {
                    this.getCustomerField(data.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }

    updateCustomerField(customerFieldData: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters) {
        this._httpClient
            .put(`api-1/customer-field`, customerFieldData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerField.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerField.next(false);
                },
                () => {
                    this.getCustomerField(customerFieldData.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }

    deleteCustomerField(id: string, customerID: string,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters) {
        this._httpClient
            .delete(`api-1/customer-field?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerField.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCustomerField(customerID, 1, limit, sort, order, search, filters);
                    this.isLoadingCustomerField.next(false);
                }
            );
    }

    getCustomerFieldExport(
        customerID: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters = { farm_id: '', status: '', calendar_year: '' }) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('farmId', filters.farm_id);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-2/customer-field?customerId=${customerID}`, { params })
            .pipe(take(1))
    }
    customerFieldImport(
        customerID: string,
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: fieldFilters = { farm_id: '', status: '', calendar_year: '' }) {
        this._httpClient
            .post(`api-2/customer-field?customerId=${customerID}`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerFieldList.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomerFieldList.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerField(customerID, 1, limit, sort, order, search, filters);
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Crop API
    getCustomerCrops(
        customer_id: string,
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters = { status: '', calendar_year: '' },
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-1/customer-crop?customerId=${customer_id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerCropList.next(true);
                    this.customerCropList.next(res);
                    this.isLoadingCustomerCropList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createCustomerCrops(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters) {
        this._httpClient
            .post(`api-1/customer-crop`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerCrop.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerCrop.next(false);
                },
                () => {
                    this.getCustomerCrops(data.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }
    updateCustomerCrops(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters) {
        this._httpClient
            .put(`api-1/customer-crop`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerCrop.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerCrop.next(false);
                },
                () => {
                    this.getCustomerCrops(data.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }
    deleteCustomerCrop(id: string, customerID: string,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters) {
        this._httpClient
            .delete(`api-1/customer-crop?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerCrop.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCustomerCrops(customerID, 1, limit, sort, order, search, filters);
                    this.isLoadingCustomerCrop.next(false);
                }
            );
    }

    getCustomerCropExport(
        customerID: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters = { status: '', calendar_year: '' },) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-2/customer-crop?customerId=${customerID}`, { params })
            .pipe(take(1))
    }
    customerCropImport(
        customerID: string,
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: cropFilters = { status: '', calendar_year: '' }) {
        this._httpClient
            .post(`api-2/customer-crop?customerId=${customerID}`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerCropList.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomerCropList.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerCrops(customerID, 1, limit, sort, order, search, filters);
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Destination API
    getCustomerDestination(
        customer_id: string,
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters = { farm_id: '', status: '', calendar_year: '' },
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('farmId', filters.farm_id);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-1/customer-destination?customerId=${customer_id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerDestinationList.next(true);
                    this.customerDestinationList.next(res);
                    this.isLoadingCustomerDestinationList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    updateCustomerDestination(
        customerDestinationData: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters) {
        this._httpClient
            .put(`api-1/customer-destination`, customerDestinationData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerDestination.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerDestination.next(false);
                },
                () => {
                    this.getCustomerDestination(customerDestinationData.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }
    createCustomerDestination(data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters) {
        this._httpClient
            .post(`api-1/customer-destination`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerDestination.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomerDestination.next(false);
                },
                () => {
                    this.getCustomerDestination(data.customer_id, 1, limit, sort, order, search, filters);
                }
            );
    }

    deleteCustomerDestination(id: string, customerID: string,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters) {
        this._httpClient
            .delete(`api-1/customer-destination?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomerDestination.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCustomerDestination(customerID, 1, limit, sort, order, search, filters);
                    this.isLoadingCustomerDestination.next(false);
                }
            );
    }
    getCustomerDestinationExport(
        customerID: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters = { farm_id: '', status: '', calendar_year: '' },
    ) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('farmId', filters.farm_id);
        params = params.set('status', filters.status);
        params = params.set('year', filters.calendar_year);
        return this._httpClient
            .get<any>(`api-2/customer-destination?customerId=${customerID}`, { params })
            .pipe(take(1))
    }
    customerDestinationImport(
        customerID: string,
        data: any,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
        filters: destinationFilters = { farm_id: '', status: '', calendar_year: '' }) {
        this._httpClient
            .post(`api-2/customer-destination?customerId=${customerID}`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomerDestinationList.next(true);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                    this.isLoadingCustomerDestinationList.next(false);
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerDestination(customerID, 1, limit, sort, order, search, filters);
                }
            );
    }

    //#endregion
    //#region Customer Rate Data Combining API
    getCombiningRate(
        id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-combining-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCombiningRateList.next(true);
                    this.combiningRateList.next(res);
                    this.isLoadingCombiningRateList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    updateCombiningRate(
        combiningRateData: any,) {
        this._httpClient
            .put(`api-1/customer-combining-rate`, combiningRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCombiningRate.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCombiningRate.next(false);
                },
                () => {
                    this.getCombiningRate(
                        combiningRateData.customer_id,
                    );
                }
            );
    }
    createCombiningRate(combiningRateData: any) {
        this._httpClient
            .post(`api-1/customer-combining-rate`, combiningRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCombiningRate.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCombiningRate.next(false);
                },
                () => {
                    this.getCombiningRate(combiningRateData.customer_id);
                }
            );
    }

    deleteCombiningRate(id: string, customerID: string) {
        this._httpClient
            .delete(`api-1/customer-combining-rate?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCombiningRate.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCombiningRate(customerID);
                    this.isLoadingCombiningRate.next(false);
                }
            );
    }

    //#endregion
    //#region Customer Rate Data Hauling API
    getHaulingRate(
        id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-hauling-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingHaulingRateList.next(true);
                    this.haulingRateList.next(res);
                    this.isLoadingHaulingRateList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createHaulingRate(haulingRateData: any) {
        this._httpClient
            .post(`api-1/customer-hauling-rate`, haulingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingHaulingRate.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingHaulingRate.next(false);
                },
                () => {
                    this.getHaulingRate(haulingRateData.customer_id);
                }
            );
    }

    updateHaulingRate(
        haulingRateData: any,) {
        this._httpClient
            .put(`api-1/customer-hauling-rate`, haulingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingHaulingRate.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingHaulingRate.next(false);
                },
                () => {
                    this.getHaulingRate(
                        haulingRateData.customer_id,
                    );
                }
            );
    }

    deleteHaulingRate(id: string, customerID: string) {
        this._httpClient
            .delete(`api-1/customer-hauling-rate?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingHaulingRate.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getHaulingRate(customerID);
                    this.isLoadingHaulingRate.next(false);
                }
            );
    }

    //#endregion
    //#region Customer Rate Data Trucking API
    getTruckingRate(
        id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-trucking-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingTruckingRateList.next(true);
                    this.truckingRateList.next(res);
                    this.isLoadingTruckingRateList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createTruckingRate(truckingRateData: any) {
        this._httpClient
            .post(`api-1/customer-trucking-rate`, truckingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingTruckingRate.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingTruckingRate.next(false);
                },
                () => {
                    this.getTruckingRate(truckingRateData.customer_id);
                }
            );
    }

    updateTruckingRate(
        truckingRateData: any,) {
        this._httpClient
            .put(`api-1/customer-trucking-rate`, truckingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingTruckingRate.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingTruckingRate.next(false);
                },
                () => {
                    this.getTruckingRate(
                        truckingRateData.customer_id,
                    );
                }
            );
    }

    deleteTruckingRate(id: string, customerID: string) {
        this._httpClient
            .delete(`api-1/customer-trucking-rate?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingTruckingRate.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getTruckingRate(customerID);
                    this.isLoadingTruckingRate.next(false);
                }
            );
    }

    //#endregion
    //#region Customer Rate Data Farming API
    getFarmingRate(
        id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/customer-farming-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingFarmingRateList.next(true);
                    this.farmingRateList.next(res);
                    this.isLoadingFarmingRateList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createFarmingRate(farmingRateData: any) {
        this._httpClient
            .post(`api-1/customer-farming-rate`, farmingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingFarmingRate.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingFarmingRate.next(false);
                },
                () => {
                    this.getFarmingRate(farmingRateData.customer_id);
                }
            );
    }

    updateFarmingRate(
        farmingRateData: any,) {
        this._httpClient
            .put(`api-1/customer-farming-rate`, farmingRateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingFarmingRate.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingFarmingRate.next(false);
                },
                () => {
                    this.getFarmingRate(
                        farmingRateData.customer_id,
                    );
                }
            );
    }

    deleteFarmingRate(id: string, customerID: string) {
        this._httpClient
            .delete(`api-1/customer-farming-rate?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingFarmingRate.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getFarmingRate(customerID);
                    this.isLoadingFarmingRate.next(false);
                }
            );
    }
    //#endregion

    getItems(folderId: string | null = null): Observable<Item[]> {
        return this._httpClient
            .get<Documents>('api/apps/customers/details', {
                params: { folderId },
            })
            .pipe(
                tap((response: any) => {
                    // this._documents.next(response);
                })
            );
    }

    //#region Customer Jobs

    getFarmingJobs(id: string, data, filters: any = { service_type: '', quantity_type: '', from: '', to: '' }) {
        let params = new HttpParams();
        params = params.set('data', data);
        params = params.set('service_type', filters.service_type);
        params = params.set('quantity_type', filters.quantity_type);
        params = params.set('from', filters.from);
        params = params.set('to', filters.to);


        return this._httpClient
            .get(`api-1/customer-job-result?customer_id=${id}`, { params })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingFarmingJobs.next(true);
                    this.customFarmingJobs.next(res);
                    this.isLoadingFarmingJobs.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }


    getTruckingJobs(id: string, data, filters: any = { from: '', to: '' }) {
        let params = new HttpParams();
        params = params.set('data', data);
        params = params.set('from', filters.from);
        params = params.set('to', filters.to);


        return this._httpClient
            .get(`api-1/customer-job-result?customer_id=${id}`, { params })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingTruckingJobs.next(true);
                    this.commercialTruckingJobs.next(res);
                    this.isLoadingTruckingJobs.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }



    getHarvestingJobs(id: string, data, filters: any = { farm_id: '', destinations: '', crop_id: '' },) {
        let params = new HttpParams();
        params = params.set('data', data);
        if (filters.farm_id?.id) {
            params = params.set('farmsId', filters.farm_id?.id);
        } else params = params.set('farmsId', '');

        params = params.set('destinations', filters.destinations);

        if (filters.crop_id?.id) {
            params = params.set('cropsId', filters.crop_id.id);
        } else params = params.set('cropsId', '');

        return this._httpClient
            .get(`api-1/customer-job-result?customer_id=${id}`, { params })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingHarvestingJobs.next(true);
                    this.customHarvestingJobs.next(res);
                    this.isLoadingHarvestingJobs.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    //#endregion

    //#region Customer Invoicing

    // getFarmingInvoices(id: string, data) {
    //     let params = new HttpParams();
    //     params = params.set('data', data);

    //     return this._httpClient
    //         .get(`api-1/customer-invoice?customer_id=${id}`, { params })
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.isLoadingFarmingInvoices.next(true);
    //                 this.farmingInvoices.next(res);
    //                 this.isLoadingFarmingInvoices.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }

    // getTruckingInvoices(id: string, data) {
    //     let params = new HttpParams();
    //     params = params.set('data', data);

    //     return this._httpClient
    //         .get(`api-1/customer-invoice?customer_id=${id}`, { params })
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.isLoadingTruckingInvoices.next(true);
    //                 this.truckingInvoices.next(res);
    //                 this.isLoadingTruckingInvoices.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }


    // getHarvestingInvoices(id: string, data) {
    //     let params = new HttpParams();
    //     params = params.set('data', data);

    //     return this._httpClient
    //         .get(`api-1/customer-invoice?customer_id=${id}`, { params })
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.isLoadingHarvestingInvoices.next(true);
    //                 this.harvestingInvoices.next(res);
    //                 this.isLoadingHarvestingInvoices.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }

    //#endregion



    //#region Customer Invoicing

    getFarmingInvoiceList(id: string, operation: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        return this._httpClient
            .get(`api-1/customer-invoices?customer_id=${id}&operation=${operation}`,)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomFarmingInvoiceList.next(true);
                    this.customFarmingInvoiceList.next(res);
                    this.isLoadingCustomFarmingInvoiceList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getJobResultsFarmingInvoice(id: string, operation, filters: any = { service_type: '', quantity_type: '', date_period_start: '', date_period_end: '' }) {
        let params = new HttpParams();
        params = params.set('operation', operation);
        params = params.set('service_type', filters.service_type);
        params = params.set('quantity_type', filters.quantity_type);
        params = params.set('from', filters.date_period_start);
        params = params.set('to', filters.date_period_end);
        return this._httpClient
            .get(`api-1/customer-invoices?customer_id=${id}`, { params })
    }

    getJobResultsTruckingInvoice(id: string, operation, filters: any = { date_period_start: '', date_period_end: '' }) {
        let params = new HttpParams();
        params = params.set('operation', operation);
        params = params.set('from', filters.date_period_start);
        params = params.set('to', filters.date_period_end);
        return this._httpClient
            .get(`api-1/customer-invoices?customer_id=${id}`, { params })
    }




    getHarvestingInvoiceList(id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        return this._httpClient
            .get(`api-1/customer-harvesting-invoice?customer_id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomHarvestingInvoiceList.next(true);
                    this.customHarvestingInvoiceList.next(res);
                    this.isLoadingCustomHarvestingInvoiceList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getTruckingInvoiceList(id: string, operation: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        return this._httpClient
            .get(`api-1/customer-invoices?customer_id=${id}&operation=${operation}`,)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomTruckingInvoiceList.next(true);
                    this.customTruckingInvoiceList.next(res);
                    this.isLoadingCustomTruckingInvoiceList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }


    getRentalInvoiceList(id: string,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {

        return this._httpClient
            .get(`api-1/customer-rental-invoice?customer_id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingCustomRentalInvoiceList.next(true);
                    this.customRentalInvoice.next(res);
                    this.isLoadingCustomRentalInvoiceList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    //#endregion


    createHarvestingInvoice(data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        this._httpClient
            .post(`api-1/customer-harvesting-invoice`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomHarvestingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomHarvestingInvoice.next(false);
                },
                () => {
                    this.getHarvestingInvoiceList(data.customer_id, sort, order, search);
                }
            );
    }

    updateHarvestingInvoice(data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .put(`api-1/customer-harvesting-invoice`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomHarvestingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomHarvestingInvoice.next(false);
                },
                () => {
                    this.getHarvestingInvoiceList(data.customer_id, sort, order, search);
                }
            );
    }




    createFarmingInvoice(invoice: any, customer_id: any, operation: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        this._httpClient
            .patch(`api-1/work-order-farming`, { invoice, operation, customerId: customer_id })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCreateFarmingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCreateFarmingInvoice.next(false);
                },
                () => {
                    this.getFarmingInvoiceList(customer_id, 'getFarmingInvoices', sort, order, search);
                }
            );
    }






    createTruckingInvoice(invoice: any, customer_id: any, operation: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        this._httpClient
            .patch(`api-1/delivery_ticket_trucking`, { invoice, operation, customerId: customer_id })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingTruckingInvoices.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingTruckingInvoices.next(false);
                },
                () => {
                    this.getTruckingInvoiceList(customer_id, 'getTruckingInvoices');
                }
            );
    }

    payFarmingInvoice(invoice_id: any, operation: any, customer_id: any) {
        this._httpClient
            .patch(`api-1/work-order-farming`, { invoice_id, operation, customerId: customer_id })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingPayFarmingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingPayFarmingInvoice.next(false);
                },
                () => {
                    this.getFarmingInvoiceList(customer_id, 'getFarmingInvoices');
                }
            );
    }

    payTruckingInvoice(invoice_id: any, operation: any, customer_id: any) {
        this._httpClient
            .patch(`api-1/delivery_ticket_trucking`, { invoice_id, operation, customerId: customer_id })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingPayFarmingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingPayFarmingInvoice.next(false);
                },
                () => {
                    this.getTruckingInvoiceList(customer_id, 'getTruckingInvoices');
                }
            );
    }






    createRentalInvoice(data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        this._httpClient
            .post(`api-1/customer-rental-invoice`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomRentalInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomRentalInvoice.next(false);
                },
                () => {
                    this.getRentalInvoiceList(data.customer_id, sort, order, search);
                }
            );
    }

    updateRentalInvoice(data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .put(`api-1/customer-rental-invoice`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingCustomRentalInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingCustomRentalInvoice.next(false);
                },
                () => {
                    this.getRentalInvoiceList(data.customer_id, sort, order, search);
                }
            );
    }



    updateTruckingJob(id: any, operation, data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .patch(`api-1/customer-job-result`, { id, operation, data })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingEditTruckingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingEditTruckingInvoice.next(false);
                },
                () => {
                    this.getTruckingJobs(data.customerId, 'trucking');
                }
            );
    }

    updateFarmingJob(id: any, operation, data: any,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '') {
        this._httpClient
            .patch(`api-1/customer-job-result`, { id, operation, data })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingEditFarmingInvoice.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingEditFarmingInvoice.next(false);
                },
                () => {
                    this.getFarmingJobs(data.customerId, 'farming');
                }
            );
    }


    //#endregion

}
