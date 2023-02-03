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
import { MatTabsModule } from '@angular/material/tabs';
import { policyDocumentsRoutes } from './policy-documents.routing';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { QuillModule } from 'ngx-quill';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ListComponent } from './list/list.component';
import { PolicyDocumentsComponent } from './policy-documents.component';
import { UploadPolicyDocumentComponent } from './list/upload-policy-document/upload-policy-document.component';

@NgModule({
    declarations: [
        PolicyDocumentsComponent,
        ListComponent,
        UploadPolicyDocumentComponent,
    ],
    imports     : [
        RouterModule.forChild(policyDocumentsRoutes),
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
        MatAutocompleteModule,
    ]
})
export class PolicyDocumentsModule
{
}
