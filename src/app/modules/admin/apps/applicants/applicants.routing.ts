import { Route } from '@angular/router';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { ApplicantsResolver, ApplicantResolver, } from 'app/modules/admin/apps/applicants/applicants.resolvers';

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
