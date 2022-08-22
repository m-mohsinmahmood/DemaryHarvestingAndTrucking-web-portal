import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { EmployeePagination, Employee , Country  } from 'app/modules/admin/apps/employee/employee.types';


@Injectable({
    providedIn: 'root'
})
export class EmployeeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _employeeService: EmployeeService,
        private _router: Router
    )
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee>
    {
        return this._employeeService.getEmployeeById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested product is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContactsCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _employeeService: EmployeeService)
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
        return this._employeeService.getCountries();
    }
}
@Injectable({
    providedIn: 'root'
})
export class EmployeesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _employeeService: EmployeeService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: EmployeePagination; products: Employee[] }>
    {
        return this._employeeService.getEmployees();
    }
}

