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
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
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
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5,10, 25, 50];
    isEdit: boolean;

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
        // passing country array
        this.countries = countryList;
        // Get the pagination
        this._applicantService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: ApplicantPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the employees
        this.applicantsdata$ = this._applicantService.applicantdata$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._applicantService.getApplicants(
                        0,
                        10,
                        'name',
                        'asc',
                        query
                    );
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get employees if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._applicantService.getApplicants(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
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

        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    // openFilterDialog() {
    //     // Open the dialog
    //     const dialogRef = this._matDialog.open(FilterComponent, {
    //         height: '800px',
    //         width: '300px',
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log('Compose dialog was closed!');
    //     });
    // }

    toggleDetails(applicantId: string): void {
        // If the product is already selected...
        /* if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        } */

        // Get the product by id
        /* this._applicantService.getProductById(productId)
            .subscribe((product) => {
                this._router.navigateByUrl('apps/employee/details/'+ productId)  */
        /* // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck(); */
        /* }); */
        this._router.navigate(['/apps/applicants/details/' + applicantId]);
    }

    closeDetails(): void {
        this.selectedProduct = null;
    }

    createEmployee(): void {
        // Create the employee
        this._applicantService.createApplicant().subscribe((newEmployee) => {
            // Go to new employee
            this.selectedProduct = newEmployee;

            // Fill the form
            this.selectedProductForm.patchValue(newEmployee);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

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
