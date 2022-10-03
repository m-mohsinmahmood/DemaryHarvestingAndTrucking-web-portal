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
    filter,
    finalize,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CropService {
    private _crops: BehaviorSubject<Crops[] | null> = new BehaviorSubject(null);
    private _crop: BehaviorSubject<Crops | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    get crops$(): Observable<Crops[]> {
        return this._crops.asObservable();
    }

    get crop$(): Observable<Crops> {
        return this._crop.asObservable();
    }

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

    getCrops(): Observable<{ crops: Crops[] }> {
        return this._httpClient
            .get<{ crops: Crops[] }>(environment.baseUrl + 'crops')
            .pipe(
                tap((response) => {
                    this._crops.next(response.crops);
                }),
                catchError(this.handleError)
            );
    }
    getCropById(id: string): Observable<Crops> {
        return this._httpClient
            .get<Crops>(environment.baseUrl + 'crops' + id)
            .pipe(
                tap((response) => {
                    this._crop.next(response);
                }),
                catchError(this.handleError)
            );
    }
    createCrop(data: any): Observable<Crops> {
        return this.crops$.pipe(
            take(1),
            switchMap((crops) =>
                this._httpClient
                    .post<Crops>(environment.baseUrl + 'crops', data)
                    .pipe(
                        tap(this.getCrops())
                        // map((newCrop) => {
                        //     // Update the crops with the new crops
                        //     this._crops.next([data, ...crops]);
                        //     // Return the new crops
                        //     return data;
                        // })
                    )
            )
        );
    }
    updateCrop(data: any): Observable<Crops> {
        return this.crops$.pipe(
            take(1),
            switchMap((crops) =>
                this._httpClient
                    .put<Crops>(environment.baseUrl + 'crops', data)
                    .pipe(
                        map((newCrop) => {
                            this._crops.next([data]);
                            return data;
                            // Update the crops with the new crops
                            // Return the new crop
                        })
                    )
            )
        );
    }
    searchCrop(data: any): Observable<{ crops: Crops[] }> {
        return this._httpClient
            .get<{ crops: Crops[] }>(
                environment.baseUrl + 'crops?search=' + data.search
            )
            .pipe(
                tap((response) => {
                    this._crops.next(response.crops);
                }),
                catchError(this.handleError)
            );
    }
}
