import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WithLoadingPipe } from './../general-pipes/with-loading.pipe';
import { PhoneMaskDirective } from './phone-mask-directive/phone-mask.directive';

@NgModule({
    declarations: [WithLoadingPipe, PhoneMaskDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WithLoadingPipe,
        PhoneMaskDirective
    ]
})
export class SharedModule
{
}
