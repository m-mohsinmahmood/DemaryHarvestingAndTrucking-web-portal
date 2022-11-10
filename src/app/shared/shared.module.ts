import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WithLoadingPipe } from './../general-pipes/with-loading.pipe';

@NgModule({
    declarations: [WithLoadingPipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WithLoadingPipe
    ]
})
export class SharedModule
{
}
