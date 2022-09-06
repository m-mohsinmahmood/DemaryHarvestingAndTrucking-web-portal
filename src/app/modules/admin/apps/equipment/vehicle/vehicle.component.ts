import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'vehicle',
    templateUrl    : './vehicle.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
