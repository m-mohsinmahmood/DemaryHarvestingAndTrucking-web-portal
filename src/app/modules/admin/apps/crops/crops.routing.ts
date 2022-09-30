import { Route } from '@angular/router';
import { CropsComponent } from 'app/modules/admin/apps/crops/crops.component';
import { CropsListComponent } from 'app/modules/admin/apps/crops/list/list.component';
import { CropsResolver } from './crops.resolvers';


export const cropsRoutes: Route[] = [
    {
        path     : '',
        component: CropsComponent,
        children : [
            {
                path     : '',
                component: CropsListComponent,
                resolve  : {
                    crops    : CropsResolver
                }
            }
        ]
    },
];
