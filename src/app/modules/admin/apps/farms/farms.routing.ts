import { Route } from '@angular/router';
import { FarmDetailsComponent } from './details/details.component';
import { FarmsComponent } from 'app/modules/admin/apps/Farms/Farms.component';
import { FarmsListComponent } from 'app/modules/admin/apps/Farms/list/list.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/apps/Farms/Farms.resolvers';

export const FarmsRoutes: Route[] = [
    {
        path     : '',
        component: FarmsComponent,
        children : [
            {
                path     : '',
                component: FarmsListComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver
                }
                // children : [
                //     {
                //         path         : 'details/:id',
                //         component    : FileManagerDetailsComponent,
                //         resolve      : {
                //             item: FileManagerItemResolver
                //         },
                //     }
                // ]
            },
            {
                path     : 'details/:Id',
                component: FarmDetailsComponent,
            },
        ]
    }
];
