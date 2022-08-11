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
import { EmployeeComponent } from 'app/modules/admin/apps/employee/employee.component';
import { EmployeeListComponent } from 'app/modules/admin/apps/employee/list/list.component';
import { EmployeeDetailComponent } from './details/details.component';
// import { ecommerceRoutes } from 'app/modules/admin/apps/ecommerce/ecommerce.routing';
import { employeeRoutes } from 'app/modules/admin/apps/employee/employee.routing';
import { AddComponent } from './add/add.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateComponent } from './update/update.component';


@NgModule({
    declarations: [
      EmployeeComponent,
      EmployeeListComponent,
      EmployeeDetailComponent,
      AddComponent,
      UpdateComponent
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
        SharedModule
    ]
})
export class EmployeeModule
{
}
