import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';



@Component({
    selector       : 'farms',
    templateUrl    : './farms.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmsComponent
{
    /**
     * Constructor
     */
    constructor(        
        )
    {
    }
    
}
