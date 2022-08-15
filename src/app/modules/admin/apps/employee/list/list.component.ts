import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {  EmployeePagination, Employee } from 'app/modules/admin/apps/employee/employee.types';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { AddComponent } from '../add/add.component';

@Component({
  selector: 'app-employee',
  templateUrl: './list.component.html',
    styles         : [
        /* language=SCSS */
        `
            .employee-grid {
                grid-template-columns: 90px 190px 0px;

                @screen sm {
                    grid-template-columns: 10% 10% 10% 20% 30% 10%;
                }
                @screen md {
                    grid-template-columns: 10% 10% 15% 25% 25% 10%;
                }

                @screen lg {
                    grid-template-columns: 10% 10% 30% 25% 15% 10%;
                }
                

                
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    employeesdata$: Observable<Employee[]>;

    
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: EmployeePagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: Employee | null = null;
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _employeeService: EmployeeService,
        private _matDialog: MatDialog,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {      

        // Get the pagination
        this._employeeService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: EmployeePagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the employees
        this.employeesdata$ = this._employeeService.employeedata$;
        console.log("PP",this.employeesdata$)

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._employeeService.getEmployees(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
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
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._employeeService.getEmployees(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
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


    openAddDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }
    /**
     * Toggle employee details
     *
     * @param employeeId
     */
    toggleDetails(employeeId: string): void
    {
        // If the product is already selected...
        /* if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        } */

        // Get the product by id
        /* this._employeeService.getProductById(productId)
            .subscribe((product) => {
                this._router.navigateByUrl('apps/employee/details/'+ productId)  */
                /* // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck(); */
            /* }); */
            this._router.navigate(["/apps/employee/details/" + employeeId])

    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }

    

    /**
     * Create employee
     */
    createEmployee(): void
    {
        // Create the employee
        this._employeeService.createEmployee().subscribe((newEmployee) => {

            // Go to new employee
            this.selectedProduct = newEmployee;

            // Fill the form
            this.selectedProductForm.patchValue(newEmployee);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected employee using the form data
     */
    updateSelectedEmployee(): void
    {
        // Get the employee object
        const employee = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete employee.currentImageIndex;

        // Update the employee on the server
        this._employeeService.updateEmployee(employee.id, employee).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected employee using the form data
     */
    deleteSelectedEmployee(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete employee',
            message: 'Are you sure you want to remove this employee? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the employee object
                const employee = this.selectedProductForm.getRawValue();

                // Delete the employee on the server
                this._employeeService.deleteEmployee(employee.id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
