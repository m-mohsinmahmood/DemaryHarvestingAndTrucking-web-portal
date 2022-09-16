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
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { customersRoutes } from 'app/modules/admin/apps/customers/customers.routing';
import { CustomersComponent } from 'app/modules/admin/apps/customers/customers.component';
import { CustomersListComponent } from 'app/modules/admin/apps/customers/list/list.component';
import { AddCustomer } from './add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerDetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AddFarmsComponent } from './details/add-farms/add-farms.component';
import { AddCropsComponent } from './details/add-crops/add-crops.component';
import { HarvestInfoComponent } from './details/harvest-info/harvest-info.component';
import { CustomerInformationComponent } from '../customers/navigation/customer-information/customer-information.component';
import { RateDataComponent } from './navigation/rate-data/rate-data.component';
import { InvoiceComponent } from './navigation/invoice/invoice.component';
import { JobStatusComponent } from './navigation/job-status/job-status.component';
import { FarmDataComponent } from './navigation/farm-data/farm-data.component';
import { ResourcesComponent } from './navigation/resources/resources.component';
import { JobDataComponent } from './navigation/job-data/job-data.component';
import { AddFarmComponent } from './navigation/farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './navigation/farm-data/add-crop/add-crop.component';
import { AddDestinationComponent } from './navigation/farm-data/add-destination/add-destination.component';

@NgModule({
    declarations: [
        CustomersComponent,
        CustomersListComponent,
        AddCustomer,
        CustomerDetailsComponent,
        UpdateComponent,
        AddFarmsComponent,
        AddCropsComponent,
        HarvestInfoComponent,
        CustomerInformationComponent,
        RateDataComponent,
        InvoiceComponent,
        JobStatusComponent,
        FarmDataComponent,
        ResourcesComponent,
        JobDataComponent,
        AddFarmComponent,
        AddCropComponent,
        AddDestinationComponent
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
        MatSidenavModule,
        MatDividerModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        SharedModule,
        MatDialogModule,
        MatTabsModule,

    ]
})
export class CustomersModule
{
}
