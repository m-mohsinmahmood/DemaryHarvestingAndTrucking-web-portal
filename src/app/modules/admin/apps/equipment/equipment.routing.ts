import { Route } from '@angular/router';
import { VehicleComponent } from 'app/modules/admin/apps/equipment/vehicle/vehicle.component';
import { VehicleListComponent } from 'app/modules/admin/apps/equipment/vehicle/list/vehicle.component';
import { VehicleDetailComponent } from 'app/modules/admin/apps/equipment/vehicle/details/details.component';
import { MachineryComponent } from 'app/modules/admin/apps/equipment/machinery/machinery.component';
import { MachineryListComponent } from 'app/modules/admin/apps/equipment/machinery/list/machinery.component';
import { PropertyComponent } from 'app/modules/admin/apps/equipment/property/property.component';
import { PropertyListComponent } from 'app/modules/admin/apps/equipment/property/list/property.component';
import { PartComponent } from 'app/modules/admin/apps/equipment/part/part.component';
import { PartListComponent } from 'app/modules/admin/apps/equipment/part/list/part.component';
import {
    InventoryBrandsResolver,
    InventoryCategoriesResolver,
    InventoryProductsResolver,
    InventoryTagsResolver,
    InventoryVendorsResolver,
} from 'app/modules/admin/apps/equipment/vehicle/vehicle.resolvers';

import {
    MachineryBrandsResolver,
    MachineryCategoriesResolver,
    MachineryProductsResolver,
    MachineryTagsResolver,
    MachineryVendorsResolver,
} from 'app/modules/admin/apps/equipment/machinery/machinery.resolvers';

export const equipmentRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'vehicle',
    },
    {
        path: 'vehicle',
        component: VehicleComponent,
        children: [
            {
                path: '',
                component: VehicleListComponent,
                resolve: {
                    brands: InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products: InventoryProductsResolver,
                    tags: InventoryTagsResolver,
                    vendors: InventoryVendorsResolver,
                },
            },
        ],
    },
    {
        path: 'machinery',
        component: MachineryComponent,
        children: [
            {
                path: '',
                component: MachineryListComponent,
                resolve: {
                    brands: MachineryBrandsResolver,
                    categories: MachineryCategoriesResolver,
                    products: MachineryProductsResolver,
                    tags: MachineryTagsResolver,
                    vendors: MachineryVendorsResolver,
                },
            },
            {
                path     : 'details/:Id',
                component: VehicleDetailComponent,
            }
        ],
    },
    {
        path: 'property',
        component: PropertyComponent,
        children: [
            {
                path: '',
                component: PropertyListComponent,
                resolve: {
                    brands: InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products: InventoryProductsResolver,
                    tags: InventoryTagsResolver,
                    vendors: InventoryVendorsResolver,
                },
            },
        ],
    },
    {
        path: 'parts-tools',
        component: PartComponent,
        children: [
            {
                path: '',
                component: PartListComponent,
                resolve: {
                    brands: InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products: InventoryProductsResolver,
                    tags: InventoryTagsResolver,
                    vendors: InventoryVendorsResolver,
                },
            },
        ],
    },
];
