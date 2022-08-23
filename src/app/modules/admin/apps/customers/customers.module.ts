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
import { customersRoutes } from 'app/modules/admin/apps/customers/customers.routing';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { AddCustomer } from './add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerDetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddFarmsComponent } from './details/add-farms/add-farms.component';
import { AddCropsComponent } from './details/add-crops/add-crops.component';
import { HarvestInfoComponent } from './details/harvest-info/harvest-info.component';

@NgModule({
    declarations: [
        CustomersComponent,
        CustomersListComponent,
        AddCustomer,
        CustomerDetailsComponent,
        UpdateComponent,
        AddFarmsComponent,
        AddCropsComponent,
        HarvestInfoComponent
    ],
    imports     : [
        RouterModule.forChild(customersRoutes),
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
        MatDialogModule,
        MatTabsModule
    ]
})
export class CustomersModule
{
}
