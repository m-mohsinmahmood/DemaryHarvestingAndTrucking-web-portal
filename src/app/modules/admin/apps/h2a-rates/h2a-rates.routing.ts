import { Route } from '@angular/router';
import { H2aRatesComponent } from './h2a-rates.component';
import { H2aRateListComponent } from './list/list.component';


export const hourlyRateRoutes: Route[] = [
    {
        path     : '',
        component: H2aRatesComponent,
        children : [
            {
                path     : '',
                component: H2aRateListComponent,
                
            }
        ]
    },
];
