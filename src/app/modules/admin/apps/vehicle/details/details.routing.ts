import { Route } from '@angular/router';
import { Routes, RouterModule } from "@angular/router";
import { DetailsComponent } from './detail.component';

export const detailRoutes: Routes = [
    // {
    //   path: "",
    //   component: DetailsComponent,
    // },
//     {
//       path      : '',
//       pathMatch : 'full',
//       redirectTo: 'inventory'
//   },
//   {
//       path     : 'inventory',
//       component: InventoryComponent,
//       children : [
//           {
//               path     : '',
//               component: InventoryListComponent,
//               resolve  : {
//                   brands    : InventoryBrandsResolver,
//                   categories: InventoryCategoriesResolver,
//                   products  : InventoryProductsResolver,
//                   tags      : InventoryTagsResolver,
//                   vendors   : InventoryVendorsResolver
//               }
//           }
//       ]
//   }
  ];