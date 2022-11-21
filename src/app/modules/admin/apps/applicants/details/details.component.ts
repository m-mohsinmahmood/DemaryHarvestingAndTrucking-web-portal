import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PreliminaryReviewDialogComponent } from './preliminary-review-dialog/premilinary-review-dialog/preliminary-review-dialog.component';



@Component({
    selector: 'applicant-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID
    panelOpenState = false;
    statusList: string[] = ['Hired', 'Evaluated', 'In-Process', 'New', 'N/A', 'Not Being Considered'];
    country_list = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
    routesLeft = [];
    routesright = [];
    selectedIndex: string = 'Applicant Data';
    items = [];
    isEdit: boolean;
    applicant: any;
    isLoadingApplicant$: Observable<any>;
    routes: any;
    applicants$ = new Subject();
    data: any;


    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;



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
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,


    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.items = [
            { content: 'Applicant Completed', name: '', date: '15/02/2022', status: 'a', active: true },
            { content: 'Advance Preliminary review', name: 'Bethnay Blake', date: '15/02/2022', status: 'b', active: true },
            { content: 'Adavnce to interview', name: 'Martha Grander', date: '15/02/2022', status: 'c', active: true },
            { content: 'Interview Completed', name: 'Bethnay Blake', date: '15/02/2022', status: 'd1', active: true },
            { content: 'Reference calls completed', name: 'Katherine synder', date: '15/02/2022', status: 'e2', active: false },
            { content: 'Recruiter decision made', name: '', date: '15/02/2022', status: 'e1', active: false },
            { content: 'Offer made', name: 'Bethnay Blake', date: '15/02/2022', status: 'e1', active: false },
            { content: 'Offer Accepted', name: 'Martha Grander', date: '15/02/2022', status: 'e1', active: false },
            { content: 'Advance to pre-employment Process', name: 'Martha Grander', date: '15/02/2022', status: 'e1', active: false },
            { content: 'Not Qualified', name: 'rejected', date: '15/02/2022', status: false, active: false },
            { content: 'Reconsider in Future', name: 'rejected', date: '15/02/2022', status: false, active: false },
        ];


        this.routesLeft = this._applicantService.applicantNavigationLeft;
        this.routesright = this._applicantService.applicantNavigationRight;
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.id;
        });



        // Get the applicant by id
        this._applicantService
            .getApplicantById(this.routeID)
            .subscribe((applicantObjData: any) => {
                this.applicant = applicantObjData;
                console.log("hello", this.applicant.first_name);

            });

        // this.applicants$.next(this._applicantService.getApplicantById(this.routeID));
        // console.log("hello", this.applicants$);

        // this.data = this._applicantService.getApplicantById(this.routeID);
        // console.log("hello", this.data);




    }

    ngAfterViewInit(): void {
        // this.initApis(this.routeID);
        // this.initObservables();
        this.initSideNavigation();
    }

    //#region Initial APIs
    // initApis(id: string) {
    // this.applicants = this._applicantService.getApplicantById(id);
    // }
    //#endregion

    //#region Initialize Observables
    // initObservables() {
    //     // Data
    //     this.applicant$ = this._applicantService.applicant$;
    //     // Loader
    //     // this.applicant$.subscribe((value)=>{console.log(value)}
    //     // );
    //     this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;
    // }
    //#endregion

    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._applicantService.applicantNavigationLeft;
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
    }

    //#endregion


    //#region Inner Navigation Routing
    routeHandler(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
            return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
    }

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    }
    //#endregion



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    openUpdateDialog(applicant): void {
        this.isEdit = true;
        console.log("im in details update comp ", applicant);
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent, {
            data: {
                isEdit: this.isEdit,
                id: this.routeID,
                calendar_year: applicant.calendar_year,
            }
        });


        dialogRef.afterClosed()
            .subscribe((result) => {
            });
    }

    backHandler(): void {
        this._router.navigate(['/apps/applicants/']);
    }
    deleteApplicant() {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete applicant',
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

    //#region Status Bar onclick
    statusBarHandler(index) {
        if (index == 1) {
            // Open the dialog
            const dialogRef = this._matDialog.open(PreliminaryReviewDialogComponent, {
                data: {}
            });
            dialogRef.afterClosed().subscribe((result) => {});
        }
    }

    //#endregion

}
