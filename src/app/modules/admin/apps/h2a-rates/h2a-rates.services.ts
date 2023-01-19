import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, take, throwError } from 'rxjs';
import { HourlyRate } from './h2a-rates.types';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
    providedIn: 'root',
})
export class H2aRatesService {
    closeDialog: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();

    //#region Loaders
    private is_loading_h2aRateList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_h2aRateList$: Observable<boolean> =
        this.is_loading_h2aRateList.asObservable();

    is_loading_h2aRate: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_h2aRate$: Observable<boolean> =
        this.is_loading_h2aRate.asObservable();
    //#endregion

    //#region Observables
    private h2aRateList: BehaviorSubject<HourlyRate[] | null> = new BehaviorSubject(null);
    readonly h2aRateList$: Observable<HourlyRate[] | null> = this.h2aRateList.asObservable();

    private h2aRate: BehaviorSubject<HourlyRate | null> = new BehaviorSubject(null);
    readonly h2aRate$: Observable<HourlyRate | null> = this.h2aRate.asObservable();
    //#endregion

    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService
    ) { }

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
    //#region Api call functions
    /**
     * Get h2aRates
     *
     *
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @param search
     */
    getH2aRates(page: number = 1, limit: number = 50, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '') {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/h2a-rates`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_h2aRateList.next(true);
                    this.h2aRateList.next(res);
                    this.is_loading_h2aRateList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getCropsAll(search: string = ''): Observable<any> {
        let params = new HttpParams();
        params = params.set('search', search);
        params = params.set('sort', 'name');
        params = params.set('order', 'asc');
        return this._httpClient.get<any>(
            `api-1/h2a-rates`,
            {
                params,
            }
        );
    }

    getH2aRateById(id: string) {
        this._httpClient
            .get(`api-1/h2a-rates${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_h2aRate.next(true);
                    this.h2aRate.next(res.h2aRateList);
                    this.is_loading_h2aRate.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    updateCrop(rateData: any) {
        this._httpClient
            .put(`api-1/h2a-rates`, rateData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_h2aRate.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update H2A Rate',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.is_loading_h2aRate.next(false);
                },
                () => {
                    this.getH2aRates();
                }
            );
    }
    // deleteCrop(id: string) {
    //     this._httpClient
    //         .delete(`api-1/crop?id=${id}`)
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.is_loading_crop.next(true);                   
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             },
    //             () => {
    //                 this.getCrops();
    //                 this.is_loading_crop.next(false);
    //             }
    //         );

    // }

    h2aRatesImport(data){
        this._httpClient
        .post(`api-2/h2a-rates`, data)
        .pipe(take(1))
        .subscribe(
            (res: any) => {
                this.closeDialog.next(true);
                this.is_loading_h2aRateList.next(true);
                //show notification based on message returned from the api
                this._alertSerice.showAlert({
                    type: 'success',
                    shake: false,
                    slideRight: true,
                    title: 'Bulk Rates Created',
                    message: res.message,
                    time: 5000,
                });
                this.is_loading_h2aRateList.next(false);
            },
            (err) => {
                this.handleError(err);
                this.closeDialog.next(false);
            },
            () => {
                this.getH2aRates();
            }
        );

    }
    //#endregion
}
