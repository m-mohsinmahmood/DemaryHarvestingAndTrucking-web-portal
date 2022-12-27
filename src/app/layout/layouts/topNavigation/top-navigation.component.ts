import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyNowComponent } from 'app/modules/admin/pages/landing-page/apply-now/apply-now.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector     : 'top-navigation-layout',
    templateUrl  : './top-navigation.component.html',
    styleUrls    : ['./top-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopNavigationComponent implements OnDestroy
{
    isScreenSmall = true;

    showAlert: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private router: Router,
        private _matDialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
 


    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
       this.isScreenSmall = !this.isScreenSmall;
    }


    navigate(){
        this.router.navigateByUrl('pages/applicant');
    }

    navigateHome(){
        this.router.navigateByUrl('pages/landing-page');
    }
    navigateEmployment(){
        this.router.navigateByUrl('pages/employment');
    }

    navigateServices(){
        this.router.navigateByUrl('pages/services');
    }
    navigateContactUs(){
        this.router.navigateByUrl('pages/contact-us');
    }
    
    
    openDialog() {
        // this.router.navigateByUrl('pages/applicant');
        const dialogRef = this._matDialog.open(ApplyNowComponent, {
            data: {},
        });
        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            //Call this function only when success is returned from the create API call//
        });

    }
}
