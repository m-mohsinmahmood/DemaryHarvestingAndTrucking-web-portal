import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { LandingPageFullscreenComponent } from 'app/modules/admin/pages/landing-page/fullscreen/landing-page.component';
import { LandingPageClassicComponent } from 'app/modules/admin/pages/landing-page/classic/landing-page.component';
import {MatExpansionModule} from '@angular/material/expansion';

const routes: Routes = [
    {
        path     : 'classic',
        component: LandingPageClassicComponent
    },
    {
        path     : '',
        component: LandingPageFullscreenComponent
    }
];

@NgModule({
    declarations: [
        LandingPageClassicComponent,
        LandingPageFullscreenComponent

    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        MatExpansionModule
    ]
})
export class LandingPageModule
{
}
