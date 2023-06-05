import { Route } from '@angular/router';
import { EmployeeComponent } from 'app/modules/admin/apps/employee/employee.component';
import { EmployeeListComponent } from 'app/modules/admin/apps/employee/list/list.component';
import { EmployeeDetailComponent } from 'app/modules/admin/apps/employee/details/details.component';
import { EmployeesResolver, EmployeeResolver, ContactsCountriesResolver, DocumentItemsResolver } from 'app/modules/admin/apps/employee/employee.resolvers';
// import { DocumentItemsResolver } from '../customers/customers.resolvers';
import { AllDwrsComponent } from './all-dwrs/all-dwrs.component';

export const employeeRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
    },
    {
        path     : 'employees',
        component: EmployeeComponent,
        children : [
            {
                path     : '',
                component: EmployeeListComponent,
                resolve  : {

                    products  : EmployeesResolver,
                    countries: ContactsCountriesResolver

                },

            },
            {
                path     : 'details/:Id',
                component: EmployeeDetailComponent,
                resolve  : {
                    products  : EmployeesResolver,
                    countries: ContactsCountriesResolver,
                    items: DocumentItemsResolver,

                },
            },
        ]
    },
    {
        path: 'all-dwrs',
        component: AllDwrsComponent,
    },
];
