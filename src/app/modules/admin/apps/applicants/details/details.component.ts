import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ComposeEmailDialogComponent } from './compose-email-dialog/compose-email-dialog.component';
import moment from 'moment';

@Component({
    selector: 'applicant-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantDetailComponent implements OnInit, OnDestroy {

    //#region Variables
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
    statusStep: string = '3';
    statusMessage: string = 'Applicant Completed';
    statusDate: any = moment().format('DD-MM-YYYY')
    preliminaryReviewForm: FormGroup;
    interviewCompletedForm: FormGroup;
    decisionMadeForm: FormGroup;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    results: string[] = ['Waitlisted','Hired','Qualifications dont match current openings'];
    //#endregion

    constructor(
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
    ) {
    }

    //#region Lifecycle functions
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.id;
        });
        this.initForm();
        this.getApplicantById();
        this.routesLeft = this._applicantService.applicantNavigationLeft;
        this.routesright = this._applicantService.applicantNavigationRight;       
    }

    ngAfterViewInit(): void {
        this.initSideNavigation();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Get Applicant By id 
    getApplicantById(){
        this._applicantService
        .getApplicantById(this.routeID)
        .subscribe((applicantObjData: any) => {
            this.applicant = applicantObjData;
        }); 
    }
    //#endregion

    //#region Init Form
    initForm() {
        this.preliminaryReviewForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: ['3'],
            recruiter_id: [{ value: '', disabled: true }],
            to: ['', [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]]
        });
        this.interviewCompletedForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: [''],
            recruiter_id: [{ value: '', disabled: true }],
            to: ['', [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]]
        });
        this.decisionMadeForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: [''],
            to: ['', [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]]
        });
    }
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
    };
    //#endregion

    //#region Dialog 
    openUpdateDialog(applicant): void {
        this.isEdit = true;
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent, {
            data: {
                isEdit: this.isEdit,
                applicantData: applicant.applicant_info,
            }
        });
        dialogRef.afterClosed()
            .subscribe((result) => {
        });
    }
    //#endregion

    //#region Back Button
    backHandler(): void {
        this._router.navigate(['/apps/applicants/']);
    }
    //#endregion
    //#region Delete Applicant
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
    //#endregion

    //#region Status Bar onclick
    composeEmail(index) {
        if (index == 1 && index <= parseInt(this.applicant?.applicant_info.status_step) ) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    preliminaryReview: true,
                    applicant: this.applicant.applicant_info,
                    form: this.preliminaryReviewForm,
                }
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
        else if (index == 2 || index == 3 || index == 4) {
            if (index == 2 && index <= parseInt(this.applicant.applicant_info.status_step)) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        firstInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                    }
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
            if (index == 3 && index <= parseInt(this.applicant.applicant_info.status_step)) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        secondInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                        
                    }
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
            if (index == 4 && index <= parseInt(this.applicant.applicant_info.status_step)) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        thirdInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                    }
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
        }
        else if (index == 6  && index <= parseInt(this.applicant.applicant_info.status_step)) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    decisionMadeForm: true,
                    applicant: this.applicant.applicant_info,
                    form: this.decisionMadeForm,
                   
                }
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
    }

    //#endregion
}
