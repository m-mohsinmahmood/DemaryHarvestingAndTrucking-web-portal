import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { SharedModule } from 'app/shared/shared.module';
import { TopNavigationComponent } from 'app/layout/layouts/topNavigation/top-navigation.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFullscreenModule } from '@fuse/components/fullscreen/fullscreen.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
    declarations: [
        TopNavigationComponent
    ],
    imports     : [
        RouterModule,
        FuseLoadingBarModule,
        SharedModule,
        MatMenuModule,
        MatButtonModule,
        SharedModule,
        MatIconModule,
        FuseNavigationModule,
        FuseFullscreenModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    exports     : [
        TopNavigationComponent
    ]
})
export class TopNavigationModule
{
}
