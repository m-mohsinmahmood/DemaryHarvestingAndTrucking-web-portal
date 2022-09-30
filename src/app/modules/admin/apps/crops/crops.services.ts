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
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';

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
        const headers = {
            'Content-Type': 'application/json',
        };
        return this._httpClient
            .get<{ crops: Crops[] }>(
                'https://dht-dev.azure-api.net/dht-dev/crops',
                {
                    headers: new HttpHeaders(headers),
                }
            )
            .pipe(
                tap((response) => {
                    this._crops.next(response.crops);
                }),
                catchError(this.handleError)
            );
    }
    getCropById(id: string): Observable<Crops>{
        const headers = {
            'Content-Type': 'application/json',
        };
        return this._httpClient
        .get<Crops>(
            'https://dht-dev.azure-api.net/dht-dev/crops' + id,
            {
                headers: new HttpHeaders(headers),
            }
        )
        .pipe(
            tap((response) => {
                this._crop.next(response);
            }),
            catchError(this.handleError)
        );
    }
    createCrop(data: any): Observable<Crops>
    {
        return this.crops$.pipe(
            take(1),
            switchMap(crops => this._httpClient.post<Crops>('https://dht-dev.azure-api.net/dht-dev/crops', data).pipe(
                map((newCrop) => {

                    // Update the products with the new product
                    this._crops.next([newCrop, ...crops]);
                    // Return the new product
                    return newCrop;
                })
            ))
        );
    }
    updateCrop(data: any): Observable<Crops>
    {
        return this.crops$.pipe(
            take(1),
            switchMap(crops => this._httpClient.put<Crops>(' https://dht-dev.azure-api.net/dht-dev/crops', data).pipe(
                map((newCrop) => {

                    // Update the products with the new product
                    this._crops.next([newCrop, ...crops]);
                    // Return the new product
                    return newCrop;
                })
            ))
        );
    }
}
