import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Machineries } from 'app/modules/admin/apps/equipment/machinery/machinery.types';
@Injectable({
    providedIn: 'root'
})
export class MachineryService {
    // Private
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
    constructor(private _httpClient: HttpClient) {
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
    handleError(err: any) {
        throw new Error('Method not implemented.');
    }
    //#endregion
}
