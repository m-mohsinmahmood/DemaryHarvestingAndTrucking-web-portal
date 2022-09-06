import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'property',
    templateUrl    : './property.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
