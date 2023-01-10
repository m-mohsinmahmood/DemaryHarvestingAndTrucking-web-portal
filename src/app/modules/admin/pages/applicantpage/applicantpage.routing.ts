import { Route } from '@angular/router';
import { ApplicantpageComponent } from './applicantpage.component';
import { ContactsCountriesResolver } from './applicants.resolvers';


export const activitiesRoutes: Route[] = [
    {
        path     : '',
        component: ApplicantpageComponent,
        resolve: {
            countries: ContactsCountriesResolver,
        },

    }
];
