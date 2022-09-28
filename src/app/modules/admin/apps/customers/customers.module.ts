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
import { MatExpansionModule } from '@angular/material/expansion';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AddFarmsComponent } from './details/add-farms/add-farms.component';
import { AddCropsComponent } from './details/add-crops/add-crops.component';
import { HarvestInfoComponent } from './details/harvest-info/harvest-info.component';
import { RateDataComponent } from './navigation/rate-data/rate-data.component';
import { InvoiceComponent } from './navigation/invoice/invoice.component';
import { JobStatusComponent } from './navigation/job-status/job-status.component';
import { FarmDataComponent } from './navigation/farm-data/farm-data.component';
import { ResourcesComponent } from './navigation/resources/resources.component';
import { JobResultComponent } from './navigation/job-result/job-result.component';
import { ContactsDataComponent } from './navigation/customer-information/contacts-data/contacts-data.component';
import { CustomersContactsList } from './navigation/customer-information/customers-contacts.component';
import { AddItemComponent } from './navigation/invoice/add-item/add-item.component';
import { AddFarmComponent } from './navigation/farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './navigation/farm-data/add-crop/add-crop.component';
import { AddDestinationComponent } from './navigation/farm-data/add-destination/add-destination.component';
import { AddCustomerContact } from './navigation/customer-information/add/add.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { DocumentComponent } from './navigation/document/document.component';

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
        RateDataComponent,
        InvoiceComponent,
        JobStatusComponent,
        FarmDataComponent,
        ResourcesComponent,
        JobResultComponent,
        ContactsDataComponent,
        CustomersContactsList,
        AddItemComponent,
        AddFarmComponent,
        AddCropComponent,
        AddDestinationComponent,
        AddCustomerContact,
        GeneralInfoComponent,
        DocumentComponent,
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
        MatGridListModule,
        MatExpansionModule

    ]
})
export class CustomersModule
{
}
