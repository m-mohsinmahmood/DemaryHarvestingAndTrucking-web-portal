import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleComponent } from './vehicle.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { vehicleRoutes } from './vehicle.routing'; 
import { AddModalComponent } from './add-modal/add-modal.component';
// import { InventoryComponent } from './inventory/inventory.component';
import { InventoryListComponent } from './list/inventory.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { DetailsComponent } from './details/detail.component';



@NgModule({
  declarations: [
    VehicleComponent,
    // InventoryComponent,
    InventoryListComponent,
    AddModalComponent,
      DetailsComponent
  ],
  imports: [  
  RouterModule.forChild(vehicleRoutes),
  CommonModule,
  MatDividerModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatDialogModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRippleModule,
  MatSortModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule,
  SharedModule
  ]
})
export class VehicleModule { }
