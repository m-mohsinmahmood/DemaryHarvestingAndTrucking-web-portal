import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'app/shared/shared.module';
import { applicantsRoutes } from 'app/modules/admin/apps/applicants/applicants.routing';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { ApplicantDetailComponent } from 'app/modules/admin/apps/applicants/details/details.component';
import { UpdateComponent } from './update/update.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { FilterComponent } from './filter/filter.component';


@NgModule({
    declarations: [
        ApplicantsComponent,
        ApplicantsListComponent,
        ApplicantDetailComponent,
        UpdateComponent,
        FilterComponent,
    ],
    imports     : [
    RouterModule.forChild(applicantsRoutes),
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
        SharedModule
    ]
})
export class ApplicantsModule
{
}
