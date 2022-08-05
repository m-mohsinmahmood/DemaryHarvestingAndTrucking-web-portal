import { Route } from '@angular/router';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/apps/customers/customers.resolvers';

export const applicantsRoutes: Route[] = [
    {
        path     : '',
        component: ApplicantsComponent,
        children : [
            {
                path     : '',
                component: ApplicantsListComponent,
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
