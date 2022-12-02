import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from 'app/shared/shared.module';
import { EmployeeComponent } from 'app/modules/admin/apps/employee/employee.component';
import { EmployeeListComponent } from 'app/modules/admin/apps/employee/list/list.component';
import { EmployeeDetailComponent } from './details/details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { employeeRoutes } from 'app/modules/admin/apps/employee/employee.routing';
import { AddComponent } from './add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateComponent } from './update/update.component';
import { UploadDocModal } from './details/details.component';
import { EmployeeDataComponent } from './navigation/employee-data/employee-data.component';
import { ProfileDataComponent } from './navigation/profile-data/profile-data.component';
import { OnboardingComponent } from './navigation/onboarding/onboarding.component';
import { AccountManagementComponent } from './navigation/account-management/account-management.component';
import { PayrollComponent } from './navigation/payroll/payroll.component';
import { DocumentsComponent } from './navigation/documents/documents.component';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MailboxComposeComponent } from './navigation/onboarding/compose/compose.component';
import { QuillModule } from 'ngx-quill';
import { UpdateProfileData } from './navigation/profile-data/update-profile-data/update.component';
import { ConfirmDialogComponent } from './navigation/account-management/confirm-dialog/confirm-dialog.component';
import { UpdateEmployeeComponent } from './navigation/employee-data/update/update.component';
@NgModule({
    declarations: [
      EmployeeComponent,
      EmployeeListComponent,
      EmployeeDetailComponent,
      AddComponent,
      UpdateComponent,
      UploadDocModal,
      EmployeeDataComponent,
      ProfileDataComponent,
      OnboardingComponent,
      AccountManagementComponent,
      PayrollComponent,
      DocumentsComponent,
      MailboxComposeComponent,
      UpdateProfileData,
      ConfirmDialogComponent,
      UpdateEmployeeComponent
    ],
    imports     : [
        RouterModule.forChild(employeeRoutes),
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
        MatRadioModule,
        MatStepperModule,
        MatDatepickerModule,
        MatSidenavModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatToolbarModule,
        MatChipsModule,
        SharedModule,
        FuseDrawerModule,
        QuillModule,
    ]
})
export class EmployeeModule
{
}
