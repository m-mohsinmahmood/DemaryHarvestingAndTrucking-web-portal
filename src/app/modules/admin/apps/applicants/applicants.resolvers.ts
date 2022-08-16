import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { EmployeePagination, Employee  } from 'app/modules/admin/apps/employee/employee.types';


@Injectable({
    providedIn: 'root'
})
export class ApplicantResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _employeeService: ApplicantService,
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
export class ApplicantsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _employeeService: ApplicantService)
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

