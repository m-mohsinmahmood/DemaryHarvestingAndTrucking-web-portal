import { Route } from '@angular/router';
import { CustomerDetailsComponent } from './details/details.component';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver, AnalyticsResolver, DocumentItemsResolver, DocumentFolderResolver, DocumentItemResolver } from 'app/modules/admin/apps/customers/customers.resolvers';

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
                    vendors   : InventoryVendorsResolver,
                    data      : AnalyticsResolver,
                }
            },
            {
                path     : 'details/:Id',
                component: CustomerDetailsComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver,
                    data      : AnalyticsResolver,
                     items: DocumentItemsResolver,
                },
            },

        ]
    }
];
