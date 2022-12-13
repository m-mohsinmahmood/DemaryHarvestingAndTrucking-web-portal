import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { NonMotorized } from './non-motorized.types';
import { equipmentNavigation } from '../equipmentNavigation';

@Injectable({
    providedIn: 'root'
})
export class NonMotorizedService
{
    public navigationLabels = equipmentNavigation;

    // Private
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
    constructor(private _httpClient: HttpClient)
    {
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
        handleError(err: any) {
            throw new Error('Method not implemented.');
        }
        //#endregion



}
