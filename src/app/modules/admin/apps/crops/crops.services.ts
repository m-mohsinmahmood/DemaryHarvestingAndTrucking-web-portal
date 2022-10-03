/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    Observable,
    take,
    throwError,
} from 'rxjs';
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
        this.is_loading_crops.asObservable();
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
    getCrops() {
        this._httpClient
            .get(`api-1/crops`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crops.next(true);
                    this.crops.next(res.crops);
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
                },
                () => {
                    this.getCrops();
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
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCrops();
                }
            );
    }

    updateCrop(data: any) {
        this._httpClient
            .post(`api-1/crops`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {},
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getCrops();
                }
            );
    }

    searchCrops(data: any) {
        this._httpClient
            .get(`api-1/crops?search=${data.search}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.is_loading_crops.next(true);
                    this.crops.next(res.crops);
                    this.is_loading_crops.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    //#endregion
}
