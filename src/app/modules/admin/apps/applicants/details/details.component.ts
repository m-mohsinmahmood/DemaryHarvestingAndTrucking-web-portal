import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { Observable, Subject, takeUntil, BehaviorSubject, lastValueFrom, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UpdateComponent } from '../update/update.component';
import { ComposeEmailDialogComponent } from './compose-email-dialog/compose-email-dialog.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';

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
    statusMessage: string = 'Application Submitted';
    statusDate: any = moment().format('DD-MM-YYYY')
    preliminaryReviewForm: FormGroup;
    interviewCompletedForm: FormGroup;
    decisionMadeForm: FormGroup;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    results: string[] = ['Waitlisted', 'Hired', 'Qualifications dont match current openings'];
    score: any = 0;
    totalScore: any = 0;
    //#endregion

    //#region Applicant Variables
    applicant$: Observable<any>;
    //#endregion

    //#region Constructor
    constructor(
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
    ) { }
    //#endregion Constructor

    //#region Lifecycle functions
    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.id;
        });

        this.applicant$ = this._applicantService.applicant$;
        this.applicant$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
            console.log("res", res);
            this.applicant = res;
            console.log('this.applicant', this.applicant);
            this.calculateScore();
            this.selectedIndex = "Applicant Data";
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

    //#region Init Form
    initForm() {
        this.preliminaryReviewForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: ['2'],
            prev_status_step: [''],
            prev_status_message: [''],
            recruiter_id: [{ value: '', disabled: true }],
            to: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]]
        });

        this.interviewCompletedForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: ['3'],
            prev_status_step: [''],
            prev_status_message: [''],
            recruiter_id: [{ value: '', disabled: true }],
            to: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]]
        });

        this.decisionMadeForm = this._formBuilder.group({
            id: [''],
            status_message: [''],
            status_step: [''],
            prev_status_step: [''],
            prev_status_message: [''],
            to: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            subject: [''],
            body: ['', [Validators.required]],
            reason_for_rejection: ['']
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

    //#region Calculate Score
    calculateScore() {
        let firstRanking = this.applicant?.applicant_info.first_call_ranking;
        let secondRanking = this.applicant?.applicant_info.second_call_ranking;
        let thirdRanking = this.applicant?.applicant_info.third_call_ranking;
        let refRanking = this.applicant?.applicant_info.reference_call_ranking;
        this.score = 0;
        if (this.applicant?.applicant_info.first_call_ranking && this.applicant?.applicant_info.second_call_ranking && this.applicant?.applicant_info.third_call_ranking && this.applicant?.applicant_info.reference_call_ranking){

            this.score = (((+firstRanking + +secondRanking + +thirdRanking + +refRanking) / 40) * 100).toFixed(2) 
        }
        else if (this.applicant?.applicant_info.first_call_ranking && this.applicant?.applicant_info.second_call_ranking && this.applicant?.applicant_info.reference_call_ranking ){

            this.score = (((+firstRanking + +secondRanking + +refRanking) / 30) * 100).toFixed(2)
        }
        else if (this.applicant?.applicant_info.first_call_ranking && this.applicant?.applicant_info.reference_call_ranking ){

            this.score = (((+firstRanking + +refRanking) / 20) * 100).toFixed(2)
        }
        else if (this.applicant?.applicant_info.first_call_ranking && this.applicant?.applicant_info.second_call_ranking && this.applicant?.applicant_info.third_call_ranking){

            this.score = (((+firstRanking + +secondRanking + +thirdRanking) / 30) * 100).toFixed(2)
        }
        else if (this.applicant?.applicant_info.first_call_ranking && this.applicant?.applicant_info.second_call_ranking){

            this.score = (((+firstRanking + +secondRanking) / 20) * 100).toFixed(2)
        }
        else if (this.applicant?.applicant_info.first_call_ranking){

            this.score = (((+firstRanking) / 10) * 100).toFixed(2)
        }
    }

    //#region Back Button
    backHandler(): void {
        this._router.navigate(['/apps/applicants/']);
    }
    //#endregion

    //#region Get Applicant By id 
    getApplicantById() {
        this._applicantService.getApplicantByIdNew(this.routeID);
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
        if (index == 1) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    preliminaryReview: true,
                    applicant: this.applicant.applicant_info,
                    form: this.preliminaryReviewForm,
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
        else if (index == 2 || index == 3 || index == 4) {
            if (index == 2) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        firstInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                    },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
            if (index == 3) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        secondInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                    },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
            if (index == 4) {
                const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                    data: {
                        thirdInterview: true,
                        interviewCompletedForm: true,
                        applicant: this.applicant.applicant_info,
                        form: this.interviewCompletedForm,
                    },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => { });
            }
        }
        else if (index == 6) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    decisionMadeForm: true,
                    makeOffer: false,
                    applicant: this.applicant.applicant_info,
                    form: this.decisionMadeForm,
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
        else if (index == 8) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    makeOffer: true,
                    decisionMadeForm: true,
                    applicant: this.applicant.applicant_info,
                    form: this.decisionMadeForm,
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
        else if (index == -1) {
            const dialogRef = this._matDialog.open(ComposeEmailDialogComponent, {
                data: {
                    decisionMadeForm: true,
                    reject: true,
                    applicant: this.applicant.applicant_info,
                    form: this.decisionMadeForm,
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((result) => { });

        }
    }
    //#endregion

    //#region Confirmation Customer Delete Dialog
    confirmAcceptRejectOffer(type): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: type === "Accept" ? "Are you sure you want to accept this Applicant as an Employee?" : "Are you sure you want to put this Applicant in Rejected Offer list?",
                title: type === "Accept" ? "Offer Accepted" : "Offer Rejected",
                hideDeleteIcon: true,
                deleteText: type === "Accept" ? "Accept" : "Reject"
            },

        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult && type === "Accept") {
                this._applicantService.patchApplicant({
                    id: this.applicant.applicant_info.id,
                    prev_status_message: "Results",
                    status_message: "Results",
                    status_step: "10.1"
                }, false);
            }
            else if (dialogResult && type === "Reject") {
                this._applicantService.patchApplicant({
                    id: this.applicant.applicant_info.id,
                    prev_status_message: "Results",
                    status_message: "Results",
                    status_step: "10.4"
                }, false);
            }
            this._applicantService.getApplicantByIdNew(this.applicant.applicant_info.id);
        });
    }
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

    expandAll() {
        this.panelOpenState = true;
    }
}
