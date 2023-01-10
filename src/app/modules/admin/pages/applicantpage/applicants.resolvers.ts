import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Country } from './applicants.types';


@Injectable({
    providedIn: 'root'
})
export class ContactsCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _applicantService: ApplicantService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._applicantService.getCountries();
    }
}

