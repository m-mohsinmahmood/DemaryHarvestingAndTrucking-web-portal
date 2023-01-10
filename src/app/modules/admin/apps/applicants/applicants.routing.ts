import { Route } from '@angular/router';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { ContactsCountriesResolver } from 'app/modules/admin/apps/applicants/applicants.resolvers';

// import { ApplicantsResolver, ApplicantResolver, } from 'app/modules/admin/apps/applicants/applicants.resolvers';
import { ApplicantDetailComponent } from './details/details.component';

export const applicantsRoutes: Route[] = [
    {
        path: '',
        component: ApplicantsComponent,
        children: [
            {
                path: '',
                component: ApplicantsListComponent,
                resolve: {
                    countries: ContactsCountriesResolver,
                },
            },
        ]
    },
    {
        path: 'details/:id',
        component: ApplicantDetailComponent,
        resolve: {
            countries: ContactsCountriesResolver,
        },
    }
];
