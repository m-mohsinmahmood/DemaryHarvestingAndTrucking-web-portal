import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'non-motorized',
    templateUrl    : './non-motorized.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NonMotorizedComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
