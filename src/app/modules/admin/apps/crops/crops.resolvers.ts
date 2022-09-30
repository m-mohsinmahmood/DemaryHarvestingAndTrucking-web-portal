import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { CropService } from './crops.services';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';

@Injectable({
    providedIn: 'root'
})
export class CropsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _cropService: CropService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ crops: Crops[] }>
    {
        return this._cropService.getCrops();
    }
}
