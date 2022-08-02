import { Route } from '@angular/router';
import { EmployeeComponent } from 'app/modules/admin/apps/employee/employee.component';
import { EmployeeListComponent } from 'app/modules/admin/apps/employee/list/list.component';
import { EmployeeDetailComponent } from 'app/modules/admin/apps/employee/details/details.component';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryProductResolver,  InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/apps/ecommerce/inventory/inventory.resolvers';

export const employeeRoutes: Route[] = [
    {
        path     : '',
        component: EmployeeComponent,
        children : [
            {
                path     : '',
                component: EmployeeListComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver
                },
                children : [
                    // {
                    // path : 'details/:id',
                    // component : EmployeeDetailComponent,
                    // resolve : {
                    //     product     : InventoryProductResolver
                    //     }
                    // },
                    // {
                    //     path     : 'details/:Id',
                    //     component: EmployeeDetailComponent,
                    // },
                ]
                
            },
            {
                path     : 'details/:Id',
                component: EmployeeDetailComponent,
            },
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
