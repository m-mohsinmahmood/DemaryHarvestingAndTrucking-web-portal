/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from '@angular/router';
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
    applicants: any;
    panelOpenState = false;
    statusList: string[] = ['Hired', 'Evaluated', 'In-Process', 'New', 'N/A', 'Not Being Considered'];
    country_list = ['Afghanistan','Albania','Algeria','Andorra','Angola','Anguilla','Antigua &amp; Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia &amp; Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Cape Verde','Cayman Islands','Chad','Chile','China','Colombia','Congo','Cook Islands','Costa Rica','Cote D Ivoire','Croatia','Cruise Ship','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Polynesia','French West Indies','Gabon','Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada','Guam','Guatemala','Guernsey','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyz Republic','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Namibia','Nepal','Netherlands','Netherlands Antilles','New Caledonia','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Pierre &amp; Miquelon','Samoa','San Marino','Satellite','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','St Kitts &amp; Nevis','St Lucia','St Vincent','St. Lucia','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor L\'Este','Togo','Tonga','Trinidad &amp; Tobago','Tunisia','Turkey','Turkmenistan','Turks &amp; Caicos','Uganda','Ukraine','United Arab Emirates','United Kingdom','Uruguay','Uzbekistan','Venezuela','Vietnam','Virgin Islands (US)','Yemen','Zambia','Zimbabwe'];
    applicants$: Observable<any>;
    routes = [];
    routes2 = [];
    selectedIndex: string = 'Applicant Data';
    items=[];




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
        this.items = [
            {content:'Applicant Completed',name:'', date:'15/02/2022', status:'a'},
            {content:'Advance Preliminary review',name:'Bethnay Blake', date:'15/02/2022', status:'b'},
            {content:'Adavnce to interview',name:'Martha Grander', date:'15/02/2022',status:'c'},
            {content:'Interview Completed',name:'Bethnay Blake', date:'15/02/2022',status:'d1'},
            {content:'Reference calls completed', name:'Katherine synder', date:'15/02/2022',status:'e1'},
            {content:'Recruiter decision made', name:'', date:'15/02/2022',status:'e1'},
            {content:'Offer made', name:'Bethnay Blake', date:'15/02/2022',status:'e1'},
            {content:'Offer Accepted', name:'Martha Grander', date:'15/02/2022',status:'e1'},
            {content:'Advance to pre-employment Process', name:'Martha Grander', date:'15/02/2022',status:'e1'},
            {content:'Not Qualified', name:'rejected', date:'15/02/2022',status:false},
            {content:'Reconsider in Future', name:'rejected', date:'15/02/2022',status:false},
        ];

        this.routes = this._applicantService.navigationLabels;
        this.routes2 = this._applicantService.navigationLabels2;
        console.log('object', this._applicantService.navigationLabels);
        this.activatedRoute.params.subscribe((params) => {
          console.log('PARAMS::', params); //log the entire params object
          this.routeID = params.id;
          console.log('object', this.routeID);

        });


       // Get the applicant by id
        this._applicantService.getApplicantById(this.routeID).subscribe((applicant) => {
            console.log('firsttt',applicant);
            this.applicants = applicant;
        });

        //  this._applicantService.applicant$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((applicant) => {
        //       this.applicants = applicant;
        //       console.log('ssssss',applicant);
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

            // Subscribe to media query change
        // this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
        // .pipe(takeUntil(this._unsubscribeAll))
        // .subscribe((state) => {

        //     // Calculate the drawer mode
        //     this.drawerMode = state.matches ? 'side' : 'over';

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
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
        this._router.navigate(['/apps/applicants/']);
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
    clicked(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
          return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
      };


}
