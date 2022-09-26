import { Route } from '@angular/router';
import { CustomerDetailsComponent } from './details/details.component';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { ContactsDataComponent } from './navigation/customer-information/contacts-data/contacts-data.component';
import { CustomersContactsList } from './navigation/customer-information/customers-contacts.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver, AnalyticsResolver } from 'app/modules/admin/apps/customers/customers.resolvers';
import { GeneralInfoComponent } from './general-info/general-info.component';

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
                }
            },
            {
                path     : 'general-information/:Id',
                component: GeneralInfoComponent,
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
                path     : 'contacts-data/:Id',
                component: ContactsDataComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver,
                    data      : AnalyticsResolver,
                }
            },

        ]
    }
];
