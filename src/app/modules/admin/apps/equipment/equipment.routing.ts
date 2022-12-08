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
import { MachineryDetailComponent } from './machinery/details/details.component';
import { PropertyBrandsResolver, PropertyCategoriesResolver, PropertyProductsResolver, PropertyTagsResolver, PropertyVendorsResolver } from './property/property.resolvers';
import { PartsBrandsResolver, PartsCategoriesResolver, PartsProductsResolver, PartsTagsResolver, PartsVendorsResolver } from './part/part.resolvers';
import { PartsDetailComponent } from './part/details/details.component';
import { PropertyDetailComponent } from './property/details/details.component';
import { ProfileComponent } from './navigation/profile/profile.component';
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
            {
                path     : 'details/:Id',
                component: VehicleDetailComponent,
                resolve: {
                    brands: InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products: InventoryProductsResolver,
                    tags: InventoryTagsResolver,
                    vendors: InventoryVendorsResolver,
                },
            }
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
                component: MachineryDetailComponent,
                resolve: {
                    brands: MachineryBrandsResolver,
                    categories: MachineryCategoriesResolver,
                    products: MachineryProductsResolver,
                    tags: MachineryTagsResolver,
                    vendors: MachineryVendorsResolver,
                },
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
                component: MotorizedDetailComponent,
                resolve: {
                    brands: MachineryBrandsResolver,
                    categories: MachineryCategoriesResolver,
                    products: MachineryProductsResolver,
                    tags: MachineryTagsResolver,
                    vendors: MachineryVendorsResolver,
                },
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
                component: NonMotorizedDetailComponent,
                resolve: {
                    brands: MachineryBrandsResolver,
                    categories: MachineryCategoriesResolver,
                    products: MachineryProductsResolver,
                    tags: MachineryTagsResolver,
                    vendors: MachineryVendorsResolver,
                },
            },
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
                    brands: PropertyBrandsResolver,
                    categories: PropertyCategoriesResolver,
                    products: PropertyProductsResolver,
                    tags: PropertyTagsResolver,
                    vendors: PropertyVendorsResolver,
                },
            },
            {
                path     : 'details/:Id',
                component: PropertyDetailComponent,
                resolve: {
                    brands: PropertyBrandsResolver,
                    categories: PropertyCategoriesResolver,
                    products: PropertyProductsResolver,
                    tags: PropertyTagsResolver,
                    vendors: PropertyVendorsResolver,
                },
            }
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
                    brands: PartsBrandsResolver,
                    categories: PartsCategoriesResolver,
                    products: PartsProductsResolver,
                    tags: PartsTagsResolver,
                    vendors: PartsVendorsResolver,
                },
            },
            {
                path     : 'details/:Id',
                component: PartsDetailComponent,
                resolve: {
                    brands: PartsBrandsResolver,
                    categories: PartsCategoriesResolver,
                    products: PartsProductsResolver,
                    tags: PartsTagsResolver,
                    vendors: PartsVendorsResolver,
                },
            }
        ],
    },
];
