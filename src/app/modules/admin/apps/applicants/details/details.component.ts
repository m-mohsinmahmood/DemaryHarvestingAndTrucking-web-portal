import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';


@Component({
    selector       : 'applicant-details',
    templateUrl    : './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class  ApplicantDetailComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    isLoading: boolean = false;
    routeID; // URL ID
    applicants:any;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,


    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
          console.log("PARAMS::", params); //log the entire params object
          this.routeID = params.id;
          console.log("object", this.routeID);
          
        });
    
    
        // Get the applicant by id
        this._applicantService.getApplicantById(this.routeID).subscribe((applicant) => {
            console.log('firsttt',applicant)
            this.applicants = applicant
        });
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
    openUpdateDialog(): void
    {
    // Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent,{
         data:{id: this.routeID}
        });
  
  
        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
      });   
    }
    
    backHandler(): void 
    {
        this._router.navigate(["/apps/applicants/"]) 
    }
    deleteApplicant(){
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete applicant',
            message: 'Are you sure you want to remove this applicant? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
    }
  

}
