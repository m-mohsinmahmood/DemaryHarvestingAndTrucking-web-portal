import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector     : 'top-navigation-layout',
    templateUrl  : './top-navigation.component.html',
    styleUrls    : ['./top-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopNavigationComponent implements OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private router: Router

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    navigate(){
        this.router.navigateByUrl('pages/applicant');
    }

    navigateHome(){
        this.router.navigateByUrl('pages/landing-page');
    }
}
