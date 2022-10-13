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

    //#region Loaders Customer Contacts
    private isLoadingCustomerContacts: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContacts$: Observable<boolean> =
        this.isLoadingCustomerContacts.asObservable();

    isLoadingCustomerContact: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContact$: Observable<boolean> =
        this.isLoadingCustomer.asObservable();
    //#endregion

    //#region Loaders Customer Field
    private isLoadingCustomerFields: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerFields$: Observable<boolean> =
        this.isLoadingCustomerFields.asObservable();

    isLoadingCustomerField: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerField$: Observable<boolean> =
        this.isLoadingCustomerField.asObservable();
    //#

    //#region Loaders Customer Farm
    private isLoadingCustomerFarms: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerFarms$: Observable<boolean> =
        this.isLoadingCustomerFarms.asObservable();

    isLoadingCustomerFarm: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerFarm$: Observable<boolean> =
        this.isLoadingCustomerFarm.asObservable();
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

    private customerContacts: BehaviorSubject<CustomerContacts[] | null> =
        new BehaviorSubject(null);
    readonly customerContacts$: Observable<CustomerContacts[] | null> =
        this.customerContacts.asObservable();

    private customerContact: BehaviorSubject<CustomerContacts | null> =
        new BehaviorSubject(null);
    readonly customerContact$: Observable<CustomerContacts | null> =
        this.customerContact.asObservable();

        // API for Destination
        private customerDestination: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly customerDestination$: Observable<any[] | null> =
        this.customerDestination.asObservable();

        // API for Crops
        private customerCrops: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    readonly customerCrops$: Observable<any[] | null> =
        this.customerCrops.asObservable();

        // Loding for destination
        is_loading_destination: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_destination$: Observable<boolean> =
        this.is_loading_destination.asObservable();

        // Loding for crops
        is_loading_crops: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
       readonly is_loading_crops$: Observable<boolean> =
        this.is_loading_crops.asObservable();


    //#endregion

    //#region Observables Customer Field
    private customerFields: BehaviorSubject<CustomerField[] | null> =
        new BehaviorSubject(null);
    readonly customerFields$: Observable<CustomerField[] | null> =
        this.customerFields.asObservable();

    private customerField: BehaviorSubject<CustomerField | null> =
        new BehaviorSubject(null);
    readonly customerField$: Observable<CustomerField | null> =
        this.customerField.asObservable();
    //#endregion

    //#region Observables Customer Field
    private customerFarms: BehaviorSubject<CustomerFarm[] | null> =
        new BehaviorSubject(null);
    readonly customerFarms$: Observable<CustomerFarm[] | null> =
        this.customerFarms.asObservable();

    private customerFarm: BehaviorSubject<CustomerFarm | null> =
        new BehaviorSubject(null);
    readonly customerFarm$: Observable<CustomerFarm | null> =
        this.customerFarm.asObservable();
    //#endregion

    private _documents: BehaviorSubject<Documents | null> = new BehaviorSubject(
        null
    );
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService
    ) {}

    get documents$(): Observable<Documents> {
        return this._documents.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

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
                        title: 'Create Customer',
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
                        title: 'Update Customer',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomers(
                        paginatioData.page,
                        paginatioData.limit,
                        paginatioData.search
                    );
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
                    this.isLoadingCustomerContacts.next(true);
                    this.customerContacts.next(res);
                    this.isLoadingCustomerContacts.next(false);
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
                        title: 'Create Customer Contact',
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

    updateCustomerContact(customerContactData: any, paginatioData: any) {
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
                        title: 'Update Customer Contact',
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
                        customerContactData.customer_id,
                        paginatioData.page,
                        paginatioData.limit,
                        paginatioData.search
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
                    this.isLoadingCustomerFields.next(true);
                    this.customerFields.next(res);
                    this.isLoadingCustomerFields.next(false);
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
                        title: 'Create Customer Field',
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

    updateCustomerField(customerFieldData: any, paginatioData: any) {
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
                        title: 'Update Customer Field',
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
                        customerFieldData.customer_id,
                        paginatioData.page,
                        paginatioData.limit,
                        paginatioData.search
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
                    this.isLoadingCustomerFarms.next(true);
                    this.customerFarms.next(res);
                    this.isLoadingCustomerFarms.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getCustomerFarmsAll(
        customerId: string,
        search: string = ''): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', 0);
        params = params.set('limit', 1000);
        params = params.set('search', search);
        params = params.set('sort', 'name');
        params = params.set('order', 'asc');
        return this._httpClient.get<any>(`api-1/customer-farm?customerId=${customerId}`, {
            params
        });
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
                        title: 'Create Customer Farm',
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

    updateCustomerFarm(customerFarmData: any, paginatioData: any) {
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
                        title: 'Update Customer Farm',
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
                        customerFarmData.customer_id,
                        paginatioData.page,
                        paginatioData.limit,
                        paginatioData.search
                    );
                }
            );
    }

    //#endregion

    //#region Destination and crops

    //Destinations functions
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
                    this.is_loading_destination.next(true);
                    this.customerDestination.next(res);
                    this.is_loading_destination.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    updateCustomerDestination(
        customerDestinationData: any,
        paginatioData: any
    ) {
        console.log('Edited data:', customerDestinationData);
        console.log('Pagination data:', paginatioData);
        this._httpClient
            .put(`api-1/customer-destination`, customerDestinationData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_destination.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Customer Destination',
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
                        paginatioData.page,
                        paginatioData.limit,
                        '',
                        '',
                        paginatioData.search
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
                    this.is_loading_destination.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Create Customer Contact',
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

    // Crop functions

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
                    this.is_loading_crops.next(true);
                    this.customerCrops.next(res);
                    this.is_loading_crops.next(false);
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
                    this.is_loading_crops.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Create Customer Crop',
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

    updateCustomerCrops(customerCropsData: any, paginatioData: any) {
        console.log('Edited Crops data:', customerCropsData);
        console.log('Pagination data:', paginatioData);
        this._httpClient
            .put(`api-1/customer-destination`, customerCropsData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crops.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Customer Destination',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getCustomerCrops(
                        customerCropsData.customer_id,
                        paginatioData.page,
                        paginatioData.limit,
                        '',
                        '',
                        paginatioData.search
                    );
                }
            );
    }

    getItems(folderId: string | null = null): Observable<Item[]> {
        return this._httpClient
            .get<Documents>('api/apps/customers/details', {
                params: { folderId },
            })
            .pipe(
                tap((response: any) => {
                    this._documents.next(response);
                })
            );
    }

}
