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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { applicantsRoutes } from 'app/modules/admin/apps/applicants/applicants.routing';
import { ApplicantsComponent } from 'app/modules/admin/apps/applicants/applicants.component';
import { ApplicantsListComponent } from 'app/modules/admin/apps/applicants/list/list.component';
import { ApplicantDetailComponent } from 'app/modules/admin/apps/applicants/details/details.component';
import { UpdateComponent } from './update/update.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterComponent } from './filter/filter.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApplicantdataComponent } from './details/applicantdata/applicantdata.component';
import { RecruiterremarksComponent } from './details/recruiterremarks/recruiterremarks.component';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { BirthDateFormat } from './update/update.component';
import { PreliminaryReviewDialogComponent } from './details/preliminary-review-dialog/premilinary-review-dialog/preliminary-review-dialog.component';
import { ComposeEmailDialogComponent } from './details/compose-email-dialog/compose-email-dialog.component'
import { QuillModule } from 'ngx-quill';


@NgModule({
    declarations: [
        ApplicantsComponent,
        ApplicantsListComponent,
        ApplicantDetailComponent,
        UpdateComponent,
        FilterComponent,
        ApplicantdataComponent,
        RecruiterremarksComponent,
        BirthDateFormat,
        ComposeEmailDialogComponent,
    ],
    imports: [
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
        MatAutocompleteModule,
        // MatDialogModule,
        // MatTabsModule,
        // MatButtonModule,
        // MatCheckboxModule,
        // MatFormFieldModule,
        // MatIconModule,
        // MatInputModule,
        // MatMenuModule,
        // MatPaginatorModule,
        // MatProgressBarModule,
        // MatRippleModule,
        // MatSortModule,
        // MatSelectModule,
        // MatSlideToggleModule,
        // MatTooltipModule,
        MatSidenavModule,
        MatDividerModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        // SharedModule,
        // MatDialogModule,
        // MatTabsModule,
        FuseDrawerModule,
        QuillModule

    ],

})
export class ApplicantsModule {
}
