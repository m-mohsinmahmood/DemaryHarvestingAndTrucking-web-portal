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
    //#region Loaders
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

    //#region Loaders
    private isLoadingCustomerContacts: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContacts$: Observable<boolean> =
        this.isLoadingCustomerContacts.asObservable();

    isLoadingCustomerContact: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingCustomerContact$: Observable<boolean> =
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

    private customerContacts: BehaviorSubject<CustomerContacts[] | null> =
        new BehaviorSubject(null);
    readonly customerContacts$: Observable<CustomerContacts[] | null> =
        this.customerContacts.asObservable();

    private customerContact: BehaviorSubject<CustomerContacts | null> =
        new BehaviorSubject(null);
    readonly customerContact$: Observable<CustomerContacts | null> =
        this.customerContact.asObservable();

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

    getCustomerById(id: string){
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
                        paginatioData.page,
                        paginatioData.limit,
                        paginatioData.search
                    );
                }
            );
    }

    //#region Customer Contact API

    //#endregion

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
