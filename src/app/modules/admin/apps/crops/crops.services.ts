/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable, ViewChild } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, take, throwError } from 'rxjs';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';

@Injectable({
    providedIn: 'root',
})
export class CropService {
    //#region Loaders
    private is_loading_crops: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly is_loading_crops$: Observable<boolean> =
        this.is_loading_crops.asObservable();

    private is_loading_crop: BehaviorSubject<boolean> =
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
    constructor(private _httpClient: HttpClient) {}

    //#region Error handling
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
    //#endregion
    //#region Api call functions
    /**
     * Get products
     *
     *
     * @param page
     * @param limit
     * @param sort
     * @param order
     * @param search
     */
    getCrops(
        page: number = 1,
        limit: number = 10,
        // sort: string = 'name',
        // order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        this._httpClient
            .get(`api-1/crops`, {
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

    getCropById(id: string) {
        this._httpClient
            .get(`api-1/crops${id}`)
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
            .post(`api-1/crops`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    //show notification based on message returned from the api
                    this.is_loading_crop.next(false);
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCrops();
                }
            );
    }

    updateCrop(cropData: any,paginatioData: any) {
        this._httpClient
            .put(`api-1/crops`, cropData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {},
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCrops(paginatioData.page,paginatioData.limit,paginatioData.search);
                }
            );
    }

    // searchCrops(data: any) {
    //     this._httpClient
    //         .get(`api-1/crops?search=${data.search}`)
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.is_loading_crops.next(true);
    //                 this.crops.next(res.crops);
    //                 this.is_loading_crops.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }
    //#endregion
}
