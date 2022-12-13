import { ApplyNowComponent } from './../apply-now/apply-now.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'landing-page-classic',
    templateUrl: './landing-page.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LandingPageFullscreenComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // // Create the form
        // this.comingSoonForm = this._formBuilder.group({
        //     email: ['', [Validators.required, Validators.email]]
        // });
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
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    register(): void {
        // // Return if the form is invalid
        // if ( this.comingSoonForm.invalid )
        // {
        //     return;
        // }

        // // Disable the form
        // this.comingSoonForm.disable();

        // // Hide the alert
        // this.showAlert = false;

        // Do your action here...
        // Emulate server delay
        // setTimeout(() => {

        //     // Re-enable the form
        //     this.comingSoonForm.enable();

        //     // Reset the form
        //     this.comingSoonNgForm.resetForm();

        //     // Set the alert
        //     this.alert = {
        //         type   : 'success',
        //         message: 'You have been registered to the list.'
        //     };

        // }, 1000);
    }
}
