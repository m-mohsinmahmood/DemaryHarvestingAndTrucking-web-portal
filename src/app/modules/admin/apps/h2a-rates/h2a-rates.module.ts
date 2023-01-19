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
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { SharedModule } from 'app/shared/shared.module';
import { hourlyRateRoutes } from './h2a-rates.routing';
import { H2aRateListComponent } from './list/list.component';
import { EditH2aRatesComponent } from './edit/edit.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { H2aRatesComponent } from './h2a-rates.component';
// import { ImportCropsComponent } from './import-crops/import-crops.component';


@NgModule({
    declarations: [
        H2aRatesComponent,
        H2aRateListComponent,
        EditH2aRatesComponent,
        // ImportCropsComponent,
    ],
    imports     : [
        RouterModule.forChild(hourlyRateRoutes),
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
        NgxDatatableModule,
        SharedModule,
        FuseDrawerModule
    ]
})
export class H2aModule
{
}
