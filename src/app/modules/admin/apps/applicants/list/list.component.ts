/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, merge, Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApplicantPagination, Applicant } from 'app/modules/admin/apps/applicants/applicants.types';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { UpdateComponent } from '../update/update.component';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { FilterComponent } from './../filter/filter.component';
import { countryList } from './../../../../../../JSON/country';

@Component({
    selector: 'app-employee',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ApplicantsListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
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
    countries: string[] =[];
    page: number;
    limit: number;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [5,10, 25, 50];
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


    // #endregion

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _applicantService: ApplicantService,
        private _matDialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    //#region life-cycle methods
    ngOnInit(): void {
        this.initObservables();
        this.initApis();
        this.initFiltersForm();
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
                    10,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    initApis() {
        this._applicantService.getApplicants();
    }
    ngAfterViewInit(): void { }

    initFiltersForm() {
        this.applicantFiltersForm = this._formBuilder.group({
            type: [''],
            status: [''],
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
        const dialogRef = this._matDialog.open(UpdateComponent,{
            data: this.isEdit,
            // height: '800px',
            // width: '900px',
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
                this.limit,
                sort.active,
                sort.direction,
                this.searchResult
                );
        }
        //#endregion


    //#region  Pagination
       pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._applicantService.getApplicants(this.page, this.limit, '', '', this.searchResult);
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

    // createEmployee(): void {
    //     // Create the employee
    //     this._applicantService.createApplicant().subscribe((newEmployee) => {
    //         // Go to new employee
    //         this.selectedProduct = newEmployee;

    //         // Fill the form
    //         this.selectedProductForm.patchValue(newEmployee);

    //         // Mark for check
    //         this._changeDetectorRef.markForCheck();
    //     });
    // }

    // pageChanged(event){
    //     console.log(event);
    //     this.page = event.pageIndex + 1;
    //     this.limit = event.pageSize;
    //     this._applicantService.getApplicantDummy(this.page,this.limit,'','','');
    // }
    // sortData(sort: any) {
    //     console.log(sort);
    //     this.page = 1;
    //     this._applicantService.getApplicantDummy(
    //         this.page,
    //         this.limit,
    //         sort.active,
    //         sort.direction,
    //         ''
    //     );
    // }
}
