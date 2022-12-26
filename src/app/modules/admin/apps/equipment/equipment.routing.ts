import { Route } from '@angular/router';
import { MachineryComponent } from 'app/modules/admin/apps/equipment/machinery/machinery.component';
import { MachineryListComponent } from 'app/modules/admin/apps/equipment/machinery/list/machinery.component';
import { MachineryDetailComponent } from './machinery/details/details.component';
import { MotorizedComponent } from './motorized/motorized.component';
import { MotorizedDetailComponent } from './motorized/details/details.component';
import { MotorizedListComponent } from './motorized/list/motorized.component';
import { NonMotorizedComponent } from './non-motorized/non-motorized.component';
import { NonMotorizedListComponent } from './non-motorized/list/non-motorized.component';
import { NonMotorizedDetailComponent } from './non-motorized/details/details.component';

export const equipmentRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'vehicle',
    },
    {
        path: 'machinery',
        component: MachineryComponent,
        children: [
            {
                path: '',
                component: MachineryListComponent,
                
            },
            {
                path     : 'details/:Id',
                component: MachineryDetailComponent,
               
            },
        ],
    },
    {
        path: 'motorized',
        component: MotorizedComponent,
        children: [
            {
                path: '',
                component: MotorizedListComponent,
                
            },
            {
                path     : 'details/:Id',
                component: MotorizedDetailComponent,
               
            },
        ],
    },
    {
        path: 'non-motorized',
        component: NonMotorizedComponent,
        children: [
            {
                path: '',
                component: NonMotorizedListComponent,
                
            },
            {
                path     : 'details/:Id',
                component: NonMotorizedDetailComponent,
                
            },
        ],
    },


];
