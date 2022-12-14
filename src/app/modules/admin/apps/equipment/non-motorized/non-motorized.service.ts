import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { NonMotorized } from './non-motorized.types';
import { equipmentNavigation } from '../equipmentNavigation';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class NonMotorizedService {
    public navigationLabels = equipmentNavigation;

    // Private
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();

    //#region Loaders Machinery List
    private isLoadingNonMotorizedList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingNonMotorizedList$: Observable<boolean> =
        this.isLoadingNonMotorizedList.asObservable();

    isLoadingNonMotorizedVehicle: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingNonMotorizedVehicle$: Observable<boolean> =
        this.isLoadingNonMotorizedVehicle.asObservable();
    //#endregion

    //#region Observables Machinery
    private nonMotorizedList: BehaviorSubject<NonMotorized[] | null> =
        new BehaviorSubject(null);
    readonly nonMotorizedList$: Observable<NonMotorized[] | null> =
        this.nonMotorizedList.asObservable();

    private nonMotorizedVehicle: BehaviorSubject<NonMotorized | null> =
        new BehaviorSubject(null);
    readonly nonMotorizedVehicle$: Observable<NonMotorized | null> =
        this.nonMotorizedVehicle.asObservable();

    private nonMotorizedExport: BehaviorSubject<NonMotorized | null> = new BehaviorSubject(null);
    readonly nonMotorizedExport$: Observable<NonMotorized | null> = this.nonMotorizedExport.asObservable();
    //#endregion


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _alertSerice: AlertService,
        ) {
    }

    //#region API Functions
    getNonMotorizedVehicles(
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
            .get<any>('api-1/non-motorized-vehicles', {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingNonMotorizedList.next(true);
                    this.nonMotorizedList.next(res);
                    this.isLoadingNonMotorizedList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getNonMotorizedVehicleById(id: string) {
        this._httpClient
            .get(`api-1/non-motorized-vehicles?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingNonMotorizedVehicle.next(true);
                    this.nonMotorizedVehicle.next(res);
                    this.isLoadingNonMotorizedVehicle.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createNonMotorized(data: any) {
        console.log(data);
            this._httpClient
                .post(`api-1/non-motorized-vehicles`, data)
                .pipe(take(1))
                .subscribe(
                    (res: any) => {
                        this.closeDialog.next(true);
                        this.isLoadingNonMotorizedVehicle.next(false);
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
                        this.isLoadingNonMotorizedVehicle.next(false);
                    },
                    () => {
                        this.getNonMotorizedVehicles(1, 10, '', '', '');
                    }
                );
        }
    
        updateNonMotorized(data: any) {
            this._httpClient
                .put(`api-1/non-motorized-vehicles`, data)
                .pipe(take(1))
                .subscribe(
                    (res: any) => {
                        this.isLoadingNonMotorizedVehicle.next(false);
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
                        this.isLoadingNonMotorizedVehicle.next(false);
                    },
                    () => {
                        this.getNonMotorizedVehicleById(data.id);
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
