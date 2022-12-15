import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Machineries } from 'app/modules/admin/apps/equipment/machinery/machinery.types';
import { AlertService } from 'app/core/alert/alert.service';
@Injectable({
    providedIn: 'root'
})
export class MachineryService {
    // Private
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();

    //#region Loaders Machinery List
    private isLoadingMachineries: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingMachineries$: Observable<boolean> =
        this.isLoadingMachineries.asObservable();

    isLoadingMachinery: BehaviorSubject<boolean> = 
    new BehaviorSubject<boolean>(false);

    readonly isLoadingMachinery$: Observable<boolean> =
        this.isLoadingMachinery.asObservable();
    //#endregion

    //#region Observables Machinery
    private machineries: BehaviorSubject<Machineries[] | null> =
        new BehaviorSubject(null);
    readonly machineries$: Observable<Machineries[] | null> =
        this.machineries.asObservable();

    private machinery: BehaviorSubject<Machineries | null> = 
    new BehaviorSubject(null);
    readonly machinery$: Observable<Machineries | null> =
        this.machinery.asObservable();

    private machineryExport: BehaviorSubject<Machineries | null> = new BehaviorSubject(null);
    readonly machineryExport$: Observable<Machineries | null> = this.machineryExport.asObservable();
    //#endregion
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _alertSerice: AlertService,
        ) {
    }
    //#region API Functions
    getMachineries(
        page: number = 1,
        limit: number = 50,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = '',
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        // params = params.set('type', filters.type);
        // params = params.set('status', filters.status)
        return this._httpClient
            .get<any>('api-1/machinery', {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMachineries.next(true);
                    this.machineries.next(res);
                    this.isLoadingMachineries.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    
    getMachineryById(id: string) {
        this._httpClient
            .get(`api-1/machinery?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMachinery.next(true);
                    this.machinery.next(res);
                    this.isLoadingMachinery.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
createMachinery(data: any) {
    console.log(data);
        this._httpClient
            .post(`api-1/machinery`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingMachinery.next(false);
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
                    this.isLoadingMachinery.next(false);
                },
                () => {
                    this.getMachineries(1, 50, '', '', '');
                }
            );
    }

    updateMachinery(machineryData: any) {
        this._httpClient
            .put(`api-1/machinery`, machineryData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMachinery.next(false);
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
                    this.isLoadingMachinery.next(false);
                },
                () => {
                    this.getMachineryById(machineryData.id);
                }
            );
    }

    //#endregion

    //#region Error handling
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
}
