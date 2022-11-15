import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { SharedModule } from 'app/shared/shared.module';
import { TopNavigationComponent } from 'app/layout/layouts/topNavigation/top-navigation.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


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
        MatIconModule
    ],
    exports     : [
        TopNavigationComponent
    ]
})
export class TopNavigationModule
{
}
