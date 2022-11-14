import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, take, throwError } from 'rxjs';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
    providedIn: 'root',
})
export class CropService {
    closeDialog: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();
    //#region Loaders
    private is_loading_crops: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_crops$: Observable<boolean> =
        this.is_loading_crops.asObservable();

    is_loading_crop: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_crop$: Observable<boolean> =
        this.is_loading_crop.asObservable();
    //#endregion
    //#region Observables
    private crops: BehaviorSubject<Crops[] | null> = new BehaviorSubject(null);
    readonly crops$: Observable<Crops[] | null> = this.crops.asObservable();

    private crop: BehaviorSubject<Crops | null> = new BehaviorSubject(null);
    readonly crop$: Observable<Crops | null> = this.crop.asObservable();
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
     * Get Crops
     *
     *
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @param search
     */
    getCrops(page: number = 1, limit: number = 10, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '') {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/crop`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crops.next(true);
                    this.crops.next(res);
                    this.is_loading_crops.next(false);
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
            `api-1/crop`,
            {
                params,
            }
        );
    }

    getCropById(id: string) {
        this._httpClient
            .get(`api-1/crop${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crop.next(true);
                    this.crop.next(res.crops);
                    this.is_loading_crop.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    createCrop(data: any) {
        this._httpClient
            .post(`api-1/crop`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.is_loading_crop.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Create Crop',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.is_loading_crop.next(false);
                },
                () => {
                    this.getCrops();
                }
            );
    }
    updateCrop(cropData: any) {
        this._httpClient
            .put(`api-1/crop`, cropData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crop.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Crop',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.is_loading_crop.next(false);
                },
                () => {
                    this.getCrops();
                }
            );
    }
    deleteCrop(id: string) {
        this._httpClient
            .delete(`api-1/crop?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crop.next(true);                   
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCrops();
                    this.is_loading_crop.next(false);
                }
            );

    }
    //#endregion
}
