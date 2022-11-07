import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { InventoryComponent } from "./inventory/inventory.component";
// import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from "./vehicle.resolvers";
import {  InventoryProductsResolver} from "./vehicle.resolvers";
import { InventoryListComponent } from "./list/inventory.component";

// import { DashboardPage } from "./dashboard.page";
import { VehicleComponent } from "./vehicle.component";
import { DetailsComponent } from './details/detail.component';

export const vehicleRoutes: Routes = [
//   {
//     path: "",
//     component: VehicleComponent,
//   },
//   {
//     path      : '',
//     pathMatch : 'full',
//     redirectTo: 'inventory'
// },

{
    path     : '',
    component: VehicleComponent,
    children : [
        {
            path     : '',
            component: InventoryListComponent,
            resolve  : {
                // brands    : InventoryBrandsResolver,
                // categories: InventoryCategoriesResolver,
                products  : InventoryProductsResolver,
                // tags      : InventoryTagsResolver,
                // vendors   : InventoryVendorsResolver

            }
        },
        // {
        //     path:'details/:id',
        //     component: DetailsComponent,
        // }
    ],
},
{
    path:'details/:id',
    component: DetailsComponent,
}
];


