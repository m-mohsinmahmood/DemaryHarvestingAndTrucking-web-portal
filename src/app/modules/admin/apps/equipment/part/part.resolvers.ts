import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { PartService } from 'app/modules/admin/apps/equipment/part/part.service';
// import { InventoryProduct } from '../vehicle/vehicle.types';
import { PartsBrand, PartsCategory, PartsProduct, PartsPagination, PartsTag, PartsVendor } from './part.types';

@Injectable({
    providedIn: 'root'
})
export class PartsBrandsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PartService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartsBrand[]>
    {
        return this._inventoryService.getBrands();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartsCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PartService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartsCategory[]>
    {
        return this._inventoryService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartsProductResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: PartService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartsProduct>
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
export class PartsProductsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PartService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: PartsPagination; products: PartsProduct[] }>
    {
        return this._inventoryService.getProducts();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartsTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PartService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartsTag[]>
    {
        return this._inventoryService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PartsVendorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: PartService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartsVendor[]>
    {
        return this._inventoryService.getVendors();
    }
}
