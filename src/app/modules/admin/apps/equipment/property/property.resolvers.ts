import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { PropertyService } from 'app/modules/admin/apps/equipment/property/property.service';
import { PropertyBrand, PropertyCategory, PropertyPagination, PropertyProduct, PropertyTag, PropertyVendor } from './property.types';

@Injectable({
    providedIn: 'root'
})
export class PropertyBrandsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PropertyService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyBrand[]>
    {
        return this._inventoryService.getBrands();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PropertyService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyCategory[]>
    {
        return this._inventoryService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyProductResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: PropertyService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyProduct>
    {
        return this._inventoryService.getProductById(route.paramMap.get('id'))
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
export class PropertyProductsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PropertyService)
    {
        console.log('PPPPP')
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: PropertyPagination; products: PropertyProduct[] }>
    {
        return this._inventoryService.getProducts();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PropertyService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyTag[]>
    {
        return this._inventoryService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PropertyVendorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PropertyService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PropertyVendor[]>
    {
        return this._inventoryService.getVendors();
    }
}
