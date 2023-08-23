import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { RateDataComponent } from './navigation/rate-data/list/rate-data.component';
import { InvoiceComponent } from './navigation/invoice/invoice.component';
import { JobStatusComponent } from './navigation/job-status/job-status.component';
import { FarmDataComponent } from './navigation/farm-data/farm-data.component';
import { ResourcesComponent } from './navigation/resources/resources.component';
import { JobResultComponent } from './navigation/job-result/job-result.component';
import { ContactsDataComponent } from './navigation/customer-information/edit/contacts-data.component';
import { CustomersContactsList } from './navigation/customer-information/list/customers-contacts.component';
import { AddTruckingItemComponent } from './navigation/invoice/add-trucking-item/add-trucking-item.component';
import { AddFieldComponent } from './navigation/farm-data/fields/add-field/add-field.component';
import { AddCropComponent } from './navigation/farm-data/crops/add-crop/add-crop.component';
import { AddDestinationComponent } from './navigation/farm-data/destinations/add-destination/add-destination.component';
import { AddCustomerContact } from './navigation/customer-information/add/add.component';
import { CustomerDetail } from './navigation/customer-detail/customer-detail.component';
import { DocumentComponent } from './navigation/document/document.component';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { AddFarmComponent } from './navigation/farm-data/farms/add-farm/add-farm.component';
import { ListFieldComponent } from './navigation/farm-data/fields/list/list.component';
import { ListFarmComponent } from './navigation/farm-data/farms/list/list.component';
import { ListCropComponent } from './navigation/farm-data/crops/list/list.component';
import { ListDestinationComponent } from './navigation/farm-data/destinations/list/list.component';
import { AddCommercialTruckingRateComponent } from './navigation/rate-data/trucking-rate/add-commercial-trucking-rate/add-commercial-trucking-rate.component';
import { AddCustomFarmingRateComponent } from './navigation/rate-data/farming-rate/add-custom-farming-rate/add-custom-farming-rate.component';
import { AddCombiningRateComponent } from './navigation/rate-data/combining-rate/add-combining-rate/add-combining-rate.component';
import { AddHaulingRateComponent } from './navigation/rate-data/hauling-rate/add-hauling-rate/add-hauling-rate.component';
import { ListCombiningRateComponent } from './navigation/rate-data/combining-rate/list-combining-rate/list-combining-rate.component';
import { ListHaulingRateComponent } from './navigation/rate-data/hauling-rate/list-hauling-rate/list-hauling-rate.component';
import { ListTruckingRateComponent } from './navigation/rate-data/trucking-rate/list-trucking-rate/list-trucking-rate.component';
import { ListFarmingRateComponent } from './navigation/rate-data/farming-rate/list-farming-rate/list-farming-rate.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmationDialogComponent } from './../../ui/confirmation-dialog/confirmation-dialog.component';
import { ImportCustomersComponent } from './import-customers/import-customers.component';
import { ImportCustomerContactsComponent } from './navigation/customer-information/import-customer-contacts/import-customer-contacts.component';
import { ImportFarmsComponent } from './navigation/farm-data/farms/import-farms/import-farms.component';
import { ImportFieldsComponent } from './navigation/farm-data/fields/import-fields/import-fields.component';
import { ImportCropsComponent } from './navigation/farm-data/crops/import-crops/import-crops.component';
import { ImportDestinationsComponent } from './navigation/farm-data/destinations/import-destinations/import-destinations.component';
import { AddHarvestingItemComponent } from './navigation/invoice/add-harvesting-item/add-harvesting-item.component';
import { AddFarmingItemComponent } from './navigation/invoice/add-farming-item/add-farming-item.component';
import { AddRentalItemComponent } from './navigation/invoice/add-rental-item/add-rental-item.component';
import { ConfirmDialogComponent } from './navigation/invoice/confirm-dialog/confirm-dialog.component';
import { AddDetailsComponent } from './navigation/invoice/add-details/add-details.component';
import { EditTruckingJobComponent } from './navigation/job-result/edit-trucking-job/edit-trucking-job.component';
import { EditFarmingJobComponent } from './navigation/job-result/edit-farming-job/edit-farming-job.component';
import { AcresHarvestingJobs } from './navigation/job-result/edit-acres-harvesting-jobs/edit-acres-harvesting-jobs.component';
import { EditAcresInHarvesting } from './navigation/job-result/only-acres-edit/edit-acres.component';
import { ReportingComponent } from './navigation/reporting/reporting.component';
@NgModule({
    declarations: [
        CustomersComponent,
        CustomersListComponent,
        AddCustomer,
        CustomerDetailsComponent,
        UpdateComponent,
        RateDataComponent,
        InvoiceComponent,
        JobStatusComponent,
        FarmDataComponent,
        ResourcesComponent,
        JobResultComponent,
        ContactsDataComponent,
        CustomersContactsList,
        AddTruckingItemComponent,
        AddFieldComponent,
        AddCropComponent,
        AddDestinationComponent,
        AddCustomerContact,
        CustomerDetail,
        DocumentComponent,
        RateDataComponent,
        AddFarmComponent,
        ListFarmComponent,
        ListFieldComponent,
        ListCropComponent,
        ListDestinationComponent,
        AddFarmComponent,
        AddCommercialTruckingRateComponent,
        AddCustomFarmingRateComponent,
        AddCombiningRateComponent,
        AddHaulingRateComponent,
        ListCombiningRateComponent,
        ListHaulingRateComponent,
        ListTruckingRateComponent,
        ListFarmingRateComponent,
        ConfirmationDialogComponent,
        ImportCustomersComponent,
        ImportCustomerContactsComponent,
        ImportFarmsComponent,
        ImportFieldsComponent,
        ImportCropsComponent,
        ImportDestinationsComponent,
        AddHarvestingItemComponent,
        AddFarmingItemComponent,
        AddRentalItemComponent,
        ConfirmDialogComponent,
        AddDetailsComponent,
        EditTruckingJobComponent,
        EditFarmingJobComponent,
        AcresHarvestingJobs,
        EditAcresInHarvesting,
        ReportingComponent
    ],
    imports: [
    RouterModule.forChild(customersRoutes),
        CommonModule,
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
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        FuseDrawerModule,
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
        SharedModule,
        MatSidenavModule,
        MatDividerModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        FuseDrawerModule,

    ]

})
export class CustomersModule {}
