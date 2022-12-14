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
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { MachineryComponent } from 'app/modules/admin/apps/equipment/machinery/machinery.component';
import { MachineryListComponent } from 'app/modules/admin/apps/equipment/machinery/list/machinery.component';
import { equipmentRoutes } from 'app/modules/admin/apps/equipment/equipment.routing';
import { UpdateAddMachineryComponent } from './machinery/update/update-add.component';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MachineryDetailComponent } from './machinery/details/details.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MotorizedComponent } from './motorized/motorized.component';
import { MotorizedDetailComponent } from './motorized/details/details.component';
import { MotorizedListComponent } from './motorized/list/motorized.component';
import { NonMotorizedComponent } from './non-motorized/non-motorized.component';
import { NonMotorizedDetailComponent } from './non-motorized/details/details.component';
import { NonMotorizedListComponent } from './non-motorized/list/non-motorized.component';
import { MachineryProfileComponent } from './machinery/navigation/profile/profile.component';
import { NonMotorizedProfileComponent } from './non-motorized/navigation/profile/profile.component';
import { MachineryMainRepairComponent } from './machinery/navigation/main-repair/main-repair.component';
import { NonMotorizedMainRepairComponent } from './non-motorized/navigation/main-repair/main-repair.component';
import { NonMotorizedLocationComponent } from './non-motorized/navigation/location/location.component';
import { MachineryLocationComponent } from './machinery/navigation/location/location.component';
import { MotorizedProfileComponent } from './motorized/navigation/profile/profile.component';
import { MotorizedMainRepairComponent } from './motorized/navigation/main-repair/main-repair.component';
import { MotorizedLocationComponent } from './motorized/navigation/location/location.component';
import { FuelsMilesComponent } from './motorized/navigation/fuels-miles/fuels-miles.component';
import { UpdateAddMotorizedComponent } from './motorized/update/update-add.component';
import { UpdateAddNonMotorizedComponent } from './non-motorized/update/update-add.component';




@NgModule({
    declarations: [
        MachineryComponent,
        MachineryListComponent,
        UpdateAddMachineryComponent,
        MachineryDetailComponent,
        NonMotorizedProfileComponent,
        MotorizedMainRepairComponent,
        MotorizedProfileComponent,
        MachineryMainRepairComponent,
        NonMotorizedMainRepairComponent,
        NonMotorizedProfileComponent,
        NonMotorizedLocationComponent,
        MotorizedLocationComponent,
        MachineryLocationComponent,
        MachineryProfileComponent,
        MotorizedComponent,
        MotorizedDetailComponent,
        MotorizedListComponent,
        NonMotorizedComponent,
        NonMotorizedDetailComponent,
        NonMotorizedListComponent,
        FuelsMilesComponent,
        UpdateAddMotorizedComponent,
        UpdateAddNonMotorizedComponent
        

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
        SharedModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatChipsModule,
        MatMenuModule,
        MatRadioModule,
        MatStepperModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatTabsModule,
        MatExpansionModule,
        FuseDrawerModule,
        MatSidenavModule,
    ]
})
export class EquipmentModule
{
}
