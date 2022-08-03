import { Route } from '@angular/router';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/apps/customers/customers.resolvers';

export const customersRoutes: Route[] = [
    {
        path     : '',
        component: CustomersComponent,
        children : [
            {
                path     : '',
                component: CustomersListComponent,
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
            }
        ]
    }
];
