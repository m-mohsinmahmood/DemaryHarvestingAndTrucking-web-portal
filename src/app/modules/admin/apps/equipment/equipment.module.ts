import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { VehicleComponent } from 'app/modules/admin/apps/equipment/vehicle/vehicle.component';
import { VehicleListComponent } from 'app/modules/admin/apps/equipment/vehicle/list/vehicle.component';
import { VehicleDetailComponent } from 'app/modules/admin/apps/equipment/vehicle/details/details.component';
import { MachineryComponent } from 'app/modules/admin/apps/equipment/machinery/machinery.component';
import { MachineryListComponent } from 'app/modules/admin/apps/equipment/machinery/list/machinery.component';
import { PropertyComponent } from 'app/modules/admin/apps/equipment/property/property.component';
import { PropertyListComponent } from 'app/modules/admin/apps/equipment/property/list/property.component';
import { PartComponent } from 'app/modules/admin/apps/equipment/part/part.component';
import { PartListComponent } from 'app/modules/admin/apps/equipment/part/list/part.component';
import { equipmentRoutes } from 'app/modules/admin/apps/equipment/equipment.routing';
import { AddModalComponent } from './vehicle/add-modal/add-modal.component';



@NgModule({
    declarations: [
        VehicleComponent,
        VehicleListComponent,
        VehicleDetailComponent,
        MachineryComponent,
        MachineryListComponent,
        PropertyComponent,
        PropertyListComponent,
        PartComponent,
        PartListComponent,
        AddModalComponent
    ],
    imports     : [
        RouterModule.forChild(equipmentRoutes),
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
        MatTabsModule,
        SharedModule
    ]
})
export class EquipmentModule
{
}
