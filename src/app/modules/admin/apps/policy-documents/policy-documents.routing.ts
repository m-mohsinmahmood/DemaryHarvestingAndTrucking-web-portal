import { Route } from '@angular/router';
import { ListComponent } from '../policy-documents/list/list.component';
import { PolicyDocumentsComponent } from './policy-documents.component';

export const policyDocumentsRoutes: Route[] = [
    {
        path     : '',
        component: ListComponent,
        // children : [
        //     {
        //         path     : '',
        //         component: ListComponent,
        //     },
        // ]
    }
];
