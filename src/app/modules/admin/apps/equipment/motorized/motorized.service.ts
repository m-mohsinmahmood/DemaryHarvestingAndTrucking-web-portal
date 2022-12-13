import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Motorized } from './motorized.types';
import { equipmentNavigation } from '../equipmentNavigation';

@Injectable({
    providedIn: 'root'
})
export class MotorizedService {
    public navigationLabels = equipmentNavigation;

    // Private
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
    constructor(private _httpClient: HttpClient) {
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
    handleError(err: any) {
        throw new Error('Method not implemented.');
    }
    //#endregion



}
