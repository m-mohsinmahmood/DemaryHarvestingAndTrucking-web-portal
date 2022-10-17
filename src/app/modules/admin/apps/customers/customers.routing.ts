import { Route } from '@angular/router';
import { CustomerDetailsComponent } from './details/details.component';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { ContactsDataComponent } from './navigation/customer-information/contacts-data/contacts-data.component';
import { CustomersContactsList } from './navigation/customer-information/customers-contacts.component';
//import { DocumentItemsResolver, InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver, AnalyticsResolver } from 'app/modules/admin/apps/customers/customers.resolvers';
import { GeneralInfoComponent } from './general-info/general-info.component';

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
                path     : 'general-information/:Id',
                component: GeneralInfoComponent
            },
            {
                path     : 'contacts-data/:Id',
                component: ContactsDataComponent
            },

        ]
    }
];
