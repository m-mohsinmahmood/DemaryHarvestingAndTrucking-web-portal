import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'motorized',
    templateUrl    : './motorized.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorizedComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
