import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, merge, Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ApplicantPagination, Applicant, Country } from 'app/modules/admin/apps/applicants/applicants.types';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { UpdateComponent } from '../update/update.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { date_format, date_format_2 } from 'JSON/date-format';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import moment from 'moment';
import { states } from './../../../../../../JSON/state';
@Directive({
    selector: '[birthdayFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: date_format_2 },
    ],
})
export class BirthDateFormat {
}

@Component({
    selector: 'app-employee',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: date_format },
    ],
})
export class ApplicantsListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    // #region local variables
    applicantsdata$: Observable<Applicant[]>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: ApplicantPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: Applicant | null = null;
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    panelOpenState = false;
    statusList: string[] = [
        'Hired',
        'Evaluated',
        'In-Process',
        'New',
        'N/A',
        'Not Being Considered',
    ];
    page: number;
    limit: number;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [50, 100, 150, 200];
    isEdit: boolean;
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    search: Subscription;
    applicant$: Observable<Applicant>;
    isLoadingApplicant$: Observable<boolean>;
    applicantList$: Observable<Applicant[]>;
    isLoadingApplicants$: Observable<boolean>;
    searchResult: string;
    applicantFiltersForm: FormGroup;
    created_at: any;
    sortActive;
    sortDirection;
    states: string[] = [];
    // #endregion

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _applicantService: ApplicantService,
        private _matDialog: MatDialog,

    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    //#region life-cycle methods
    ngOnInit(): void {
        this.initCreatedAt();
        this.initObservables();
        this.initApis();
        this.initFiltersForm();

        this.states = states;
    }

    initObservables() {
        this.isLoadingApplicants$ = this._applicantService.isLoadingApplicants$;
        this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;
        this.applicantList$ = this._applicantService.applicantList$;
        this.applicant$ = this._applicantService.applicant$;
        this.search = this.searchform.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((data) => {
                this.searchResult = data.search;
                this.page = 1;
                this._applicantService.getApplicants(
                    1,
                    this.pageSize,
                    '',
                    '',
                    this.searchResult,
                    this.applicantFiltersForm.value
                );
            });
    }

    initApis() {
        this._applicantService.getApplicants();
    }
    ngAfterViewInit(): void { }

    initFiltersForm() {
        this.applicantFiltersForm = this._formBuilder.group({
            date: [''],
            status: [''],
            ranking: [''],
            state: [''],
            created_at: [''],
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    openAddDialog(): void {
        this.isEdit = false;
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent, {
            data: this.isEdit,
        });

        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            //Call this function only when success is returned from the create API call//
        });
    }

    //#region Sort Function
    sortData(sort: any) {
        this.page = 1;
        this._applicantService.getApplicants(
            this.page,
            this.pageSize,
            sort.active,
            sort.direction,
            this.searchResult,
            this.applicantFiltersForm.value
        );
    }
    //#endregion


    //#region  Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this._applicantService.getApplicants(this.page, this.pageSize, '', '', this.searchResult, this.applicantFiltersForm.value);
    }
    //#endregion

    toggleDetails(applicantId: string): void {
        this._applicantService
            .getApplicantById(applicantId)
            .subscribe((applicantObjData: any) => {
                this._router.navigate(['/apps/applicants/details/' + applicantObjData.applicant_info.id]);
            });

    }

    closeDetails(): void {
        this.selectedProduct = null;
    }
    //#region Filters
    initCreatedAt() {
        this.created_at = new FormControl();
    }
    applyFilters() {
        this.page = 1;
        !this.applicantFiltersForm.value.state ? (this.applicantFiltersForm.value.state = '') : ('');
        !this.applicantFiltersForm.value.created_at ? (this.applicantFiltersForm.value.created_at = '') : ('');
        !this.applicantFiltersForm.value.status ? (this.applicantFiltersForm.value.status = '') : ('');
        !this.applicantFiltersForm.value.date ? (this.applicantFiltersForm.value.date = '') : ('');
        !this.applicantFiltersForm.value.ranking ? (this.applicantFiltersForm.value.ranking = '') : ('');
        this.created_at.value ? (this.applicantFiltersForm.value.created_at = this.created_at.value) : ''
        this._applicantService.getApplicants(
            1,
            this.pageSize,
            this.sortActive,
            this.sortDirection,
            this.searchResult,
            this.applicantFiltersForm.value
        );
    }

    removeFilters() {
        this.page = 1;
        this.applicantFiltersForm.reset();
        this.applicantFiltersForm.value.state = '';
        this.applicantFiltersForm.value.created_at = '';
        this.applicantFiltersForm.value.status = '';
        this.applicantFiltersForm.value.ranking = '';
        this.applicantFiltersForm.value.date = '';
        this.created_at.setValue('');
        this._applicantService.getApplicants(
            1,
            this.pageSize,
            this.sortActive,
            this.sortDirection,
            this.searchResult,
            this.applicantFiltersForm.value
        );
    }

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment();
        ctrlValue.year(normalizedYear.year());
        this.created_at.setValue(ctrlValue.format('YYYY'));
        this.applicantFiltersForm.value.created_at = ctrlValue.format('YYYY');
        datepicker.close();
    }

    //#region Confirmation Customer Crops Delete Dialog
    confirmDeleteDialog(applicantId: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Applicant?',
                title: 'Applicant',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult)
                this._applicantService.deleteApplicant(applicantId);
        });
    }
    //#endregion

    //#region find country code 
    getCountryCode(country_code) {
        if (country_code && country_code != 'zz')
        return  '+' + country_code?.split("+")[1];
    }
    //#endregion
}


