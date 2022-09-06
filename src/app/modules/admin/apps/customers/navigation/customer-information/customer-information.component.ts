import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'customer-information',
    templateUrl: './customer-information.component.html',
})

export class CustomerInformationComponent implements OnInit {

    @Input() customers: any;


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(private _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {}
}
