import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'machinery',
    templateUrl    : './machinery.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MachineryComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
