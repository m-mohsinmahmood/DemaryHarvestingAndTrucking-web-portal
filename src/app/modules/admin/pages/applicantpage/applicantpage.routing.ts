import { Route } from '@angular/router';
import { ActivitiesComponent } from 'app/modules/admin/pages/activities/activities.component';
import { ActivitiesResolver } from 'app/modules/admin/pages/activities/activities.resolvers';
import { ApplicantpageComponent } from './applicantpage.component';

export const activitiesRoutes: Route[] = [
    {
        path     : '',
        component: ApplicantpageComponent,

    }
];
