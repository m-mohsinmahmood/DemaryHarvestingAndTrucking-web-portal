import { Route } from '@angular/router';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { ApplicantsResolver, ApplicantResolver, } from 'app/modules/admin/apps/applicants/applicants.resolvers';
import { ApplicantDetailComponent } from './details/details.component';

export const applicantsRoutes: Route[] = [
    {
        path     : '',
        component: ApplicantsComponent,
        children : [
            {
                path     : '',
                component: ApplicantsListComponent,
                resolve  : {
                    products  : ApplicantsResolver,
                },
            },
        ]
    },
    {
        path:'details/:id',
        component: ApplicantDetailComponent,
        resolve  : {
            product  : ApplicantsResolver,
        },
    }
];
