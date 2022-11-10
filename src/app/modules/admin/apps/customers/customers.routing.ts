import { Route } from '@angular/router';
import { CustomerDetailsComponent } from './details/details.component';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { ContactsDataComponent } from './navigation/customer-information/edit/contacts-data.component';
import { CustomersContactsList } from './navigation/customer-information/list/customers-contacts.component';
//import { DocumentItemsResolver, InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver, AnalyticsResolver } from 'app/modules/admin/apps/customers/customers.resolvers';

export const customersRoutes: Route[] = [
    {
        path     : '',
        component: CustomersComponent,
        children : [
            {
                path     : '',
                component: CustomersListComponent
            },
            {
                path     : 'details/:Id',
                component: CustomerDetailsComponent
            },
            {
                path     : 'contacts-data/:Id',
                component: ContactsDataComponent
            },

        ]
    }
];
