import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Motorized } from './motorized.types';
import { equipmentNavigation } from '../equipmentNavigation';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class MotorizedService {
    public navigationLabels = equipmentNavigation;

    // Private
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();

    //#region Loaders Machinery List
    private isLoadingMotorizedList: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingMotorizedList$: Observable<boolean> =
        this.isLoadingMotorizedList.asObservable();

    isLoadingMotorizedVehicle: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    readonly isLoadingMotorizedVehicle$: Observable<boolean> =
        this.isLoadingMotorizedVehicle.asObservable();
    //#endregion


    //#region Observables Machinery
    private motorizedList: BehaviorSubject<Motorized[] | null> =
        new BehaviorSubject(null);
    readonly motorizedList$: Observable<Motorized[] | null> =
        this.motorizedList.asObservable();

    private motorizedVehicle: BehaviorSubject<Motorized | null> =
        new BehaviorSubject(null);
    readonly motorizedVehicle$: Observable<Motorized | null> =
        this.motorizedVehicle.asObservable();

    private motorizedExport: BehaviorSubject<Motorized | null> = new BehaviorSubject(null);
    readonly motorizedExport$: Observable<Motorized | null> = this.motorizedExport.asObservable();
    //#endregion

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _alertSerice: AlertService,
    ) {
    }

    //#region API Functions
    getMotorizedVehicles(
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
            .get<any>('api-1/motorized-vehicles', {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMotorizedList.next(true);
                    this.motorizedList.next(res);
                    this.isLoadingMotorizedList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getMotorizedVehicleById(id: string) {
        this._httpClient
            .get(`api-1/motorized-vehicles?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMotorizedVehicle.next(true);
                    this.motorizedVehicle.next(res);
                    this.isLoadingMotorizedVehicle.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    createMotorized(data: any) {
        console.log(data);
        this._httpClient
            .post(`api-1/motorized-vehicles`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingMotorizedVehicle.next(false);
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
                    this.isLoadingMotorizedVehicle.next(false);
                },
                () => {
                    this.getMotorizedVehicles(1, 50, '', '', '');
                }
            );
    }

    updateMotorized(machineryData: any) {
        this._httpClient
            .put(`api-1/motorized-vehicles`, machineryData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingMotorizedVehicle.next(false);
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
                    this.isLoadingMotorizedVehicle.next(false);
                },
                () => {
                    this.getMotorizedVehicleById(machineryData.id);
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
