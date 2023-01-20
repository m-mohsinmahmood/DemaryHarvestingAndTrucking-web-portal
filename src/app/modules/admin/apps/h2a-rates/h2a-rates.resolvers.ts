import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { H2aRatesService } from './h2a-rates.services';
import { Crops } from 'app/modules/admin/apps/crops/crops.types';

@Injectable({
    providedIn: 'root'
})
export class H2aRatesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _h2aRatesService: H2aRatesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        return this._h2aRatesService.getCrops();
    }
}
