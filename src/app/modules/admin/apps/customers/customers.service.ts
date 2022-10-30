/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
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
} from 'app/modules/admin/apps/customers/customers.types';
import { customerNavigation } from './customerNavigation';
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

    // Loaders
    private isLoadingCustomerContactList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContactList$: Observable<boolean> =
        this.isLoadingCustomerContactList.asObservable();

    isLoadingCustomerContact: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContact$: Observable<boolean> =
        this.isLoadingCustomer.asObservable();

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
        private _alertSerice: AlertService
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
        limit: number = 10,
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

    createCustomer(data: any) {
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
                },
                () => {
                    this.getCustomers();
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
                },
                () => {
                    this.getCustomerById(customerData.id);
                }
            );
    }

    //#endregion
    //#region Customer Contact API
    getCustomerContact(
        id: string,
        page: number = 1,
        limit: number = 10,
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

    createCustomerContact(data: any) {
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
                },
                () => {
                    this.getCustomerContact(data.customer_id);
                }
            );
    }

    updateCustomerContact(customerContactData: any) {
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
                        customerContactData.customer_id
                    );
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Farm API
    getCustomerFarm(
        customerId: string,
        page: number = 1,
        limit: number = 10,
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
    getCustomerSummaryFarm(
        customerId: string,
        page: number = 1,
        limit: number = 5,
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

    createCustomerFarm(data: any) {
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
                },
                () => {
                    this.getCustomerFarm(data.customer_id);
                }
            );
    }

    updateCustomerFarm(customerFarmData: any) {
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
                },
                () => {
                    this.getCustomerFarm(
                        customerFarmData.customer_id
                    );
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Field API
    getCustomerField(
        customerId: string,
        page: number = 1,
        limit: number = 10,
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
            .get<any>(`api-1/customer-field?customerId=${customerId}`, {
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
    getCustomerSummaryField(
        customerId: string,
        page: number = 1,
        limit: number = 5,
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
            .get<any>(`api-1/customer-field?customerId=${customerId}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    // this.isLoadingCustomerFields.next(true);
                    // this.customerSummaryFields.next(res);
                    // this.isLoadingCustomerFields.next(false);
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

    createCustomerField(data: any) {
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
                },
                () => {
                    this.getCustomerField(data.customer_id);
                }
            );
    }

    updateCustomerField(customerFieldData: any) {
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
                },
                () => {
                    this.getCustomerField(
                        customerFieldData.customer_id
                    );
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Crop API
    getCustomerCrops(
        id: string,
        page: number = 1,
        limit: number = 10,
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
            .get<any>(`api-1/customer-crop?customerId=${id}`, {
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

    createCustomerCrops(data: any) {
        this._httpClient
            .post(`api-1/customer-crop`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
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
                },
                () => {
                    this.getCustomerCrops(data.customer_id);
                }
            );
    }
    updateCustomerCrops(data: any) {
        this._httpClient
            .put(`api-1/customer-crop`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
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
                },
                () => {
                    this.getCustomerCrops(data.customer_id);
                }
            );
    }

    //#endregion
    //#region Customer Farm Data Destination API
    getCustomerDestination(
        id: string,
        page: number = 1,
        limit: number = 10,
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
            .get<any>(`api-1/customer-destination?customerId=${id}`, {
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

    getCustomerSummaryDestination(
        id: string,
        page: number = 1,
        limit: number = 5,
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
            .get<any>(`api-1/customer-destination?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    // this.is_loading_destination.next(true);
                    // this.customerDestination.next(res);
                    // this.is_loading_destination.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    updateCustomerDestination(
        customerDestinationData: any,) {
        this._httpClient
            .put(`api-1/customer-destination`, customerDestinationData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
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
                    this.getCustomerDestination(
                        customerDestinationData.customer_id,
                    );
                }
            );
    }
    createCustomerDestination(data: any) {
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
                },
                () => {
                    this.getCustomerDestination(data.customer_id);
                }
            );
    }
    //#endregion
    //#region Customer Rate Data Combining API
     getCombiningRate(
        id: string,
        page: number = 1,
        limit: number = 10,
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

    // getHaulingRateSummary(
    //     id: string,
    //     page: number = 1,
    //     limit: number = 5,
    //     sort: string = '',
    //     order: 'asc' | 'desc' | '' = '',
    //     search: string = ''
    // ) {
    //     let params = new HttpParams();
    //     params = params.set('page', page);
    //     params = params.set('limit', limit);
    //     params = params.set('search', search);
    //     params = params.set('sort', sort);
    //     params = params.set('order', order);
    //     return this._httpClient
    //         .get<any>(`api-1/customer-destination?customerId=${id}`, {
    //             params,
    //         })
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 // this.is_loading_destination.next(true);
    //                 // this.customerDestination.next(res);
    //                 // this.is_loading_destination.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }

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
                },
                () => {
                    this.getCustomerDestination(
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
                },
                () => {
                    this.getCombiningRate(combiningRateData.customer_id);
                }
            );
    }
    //#endregion
    //#region Customer Rate Data Hauling API
    getHaulingRate(
        id: string,
        page: number = 1,
        limit: number = 10,
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

    getHaulingRateSummary(
        id: string,
        page: number = 1,
        limit: number = 5,
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
            .get<any>(`api-1/customer-hauling-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    // this.is_loading_destination.next(true);
                    // this.customerDestination.next(res);
                    // this.is_loading_destination.next(false);
                },
                (err) => {
                    this.handleError(err);
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
                    this.isLoadingHaulingRate.next(false);
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
                    this.getHaulingRate(
                        haulingRateData.customer_id,
                    );
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
                },
                () => {
                    this.getHaulingRate(haulingRateData.customer_id);
                }
            );
    }
    //#endregion
    //#region Customer Rate Data Trucking API
      getTruckingRate(
        id: string,
        page: number = 1,
        limit: number = 10,
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

    getTruckingRateSummary(
        id: string,
        page: number = 1,
        limit: number = 5,
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
            .get<any>(`api-1/customer-trucking-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    // this.is_loading_destination.next(true);
                    // this.customerDestination.next(res);
                    // this.is_loading_destination.next(false);
                },
                (err) => {
                    this.handleError(err);
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
                    this.getTruckingRate(
                        truckingRateData.customer_id,
                    );
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
                },
                () => {
                    this.getTruckingRate(truckingRateData.customer_id);
                }
            );
    }
    //#endregion
    //#region Customer Rate Data Farming API
    getFarmingRate(
        id: string,
        page: number = 1,
        limit: number = 10,
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

    getFarmingRateSummary(
        id: string,
        page: number = 1,
        limit: number = 5,
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
            .get<any>(`api-1/customer-farming-rate?customerId=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    // this.is_loading_destination.next(true);
                    // this.customerDestination.next(res);
                    // this.is_loading_destination.next(false);
                },
                (err) => {
                    this.handleError(err);
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
                    this.getFarmingRate(
                        farmingRateData.customer_id,
                    );
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
                },
                () => {
                    this.getFarmingRate(farmingRateData.customer_id);
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
}
