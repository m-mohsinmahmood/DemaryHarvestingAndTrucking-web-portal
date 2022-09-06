import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'part',
    templateUrl    : './part.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
