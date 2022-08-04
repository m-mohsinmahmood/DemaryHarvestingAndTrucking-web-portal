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
import { SharedModule } from 'app/shared/shared.module';
import { FarmsRoutes } from 'app/modules/admin/apps/farms/farms.routing';
import { FarmsListComponent } from './list/list.component';
import { AddFarm } from './add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FarmDetailsComponent } from './details/details.component';
import { FarmsComponent } from './farms.component';


@NgModule({
    declarations: [
        FarmsComponent,
        FarmsListComponent,
        AddFarm,
        FarmDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(FarmsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        MatDialogModule
    ]
})
export class FarmsModule
{
}
