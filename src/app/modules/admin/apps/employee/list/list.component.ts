import { BooleanInput } from '@angular/cdk/coercion';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    EmployeePagination,
    Employee,
} from 'app/modules/admin/apps/employee/employee.types';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { AddComponent } from '../add/add.component';
import { read, utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';

@Component({
    selector: 'app-employee',
    templateUrl: './list.component.html',
    styles: [
        /* language=SCSS */
        `
            .employee-grid {
                grid-template-columns: 10% 50% 30%;

                @screen sm {
                    grid-template-columns: 3% 20% 25% 30% 10%;
                }
                @screen md {
                    grid-template-columns: 3% 25% 30% 25% 10%;
                }
                @screen lg {
                    grid-template-columns: 3% 25% 30% 25% 10%;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    employeesdata$: Observable<Employee[]>;
    employeeList: any[] = [];
    importEmployeeList: any[] = [];
    arrayBuffer: any;
    file: File;
    fileError: string = '';
    isFileError: boolean = false;
    fileHeaders: any[] = [];
    importFileData: any;

    importSchema = Joi.object({
        fullName: Joi.string().min(3).max(30).required(),
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        email: Joi.string().required(),
        address: Joi.string().min(3).max(30).required(),
        phone: Joi.number().required(),
        emergencyContact: Joi.number().required(),
        bankingInfo: Joi.string().min(3).max(30).required(),
        active: Joi.required(),
        harvestYear: Joi.required(),
        position: Joi.string().min(3).max(30).required(),
        salary: Joi.number().required(),
        currentEmployee: Joi.required(),
    });

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
        private _matDialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
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
        this.employeesdata$.subscribe((value) => {
            this.employeeList = value;
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._employeeService.getEmployees(
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

    /**
     * After view init
     */
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
                        return this._employeeService.getEmployees(
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

    incomingfile(event) {
        this.file = event.target.files[0];
    }
    upload() {
        let fileReader = new FileReader();
        fileReader.onload = async (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i)
                arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join('');
            var workbook = XLSX.read(bstr, { type: 'binary' });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.importEmployeeList = XLSX.utils.sheet_to_json(worksheet, {});
            this.fileHeaders = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
            });
            this.fileHeaders[0].push('Errors');
            await this.importValidation();
            if (this.isFileError) {
                const headings = [this.fileHeaders[0]];
                const wb = utils.book_new();
                const ws: any = utils.json_to_sheet([]);
                utils.sheet_add_aoa(ws, headings);
                utils.sheet_add_json(ws, this.importEmployeeList, {
                    origin: 'A2',
                    skipHeader: true,
                });
                utils.book_append_sheet(wb, ws, 'Report');
                writeFile(wb, 'employee Report logs.xlsx');
            }
        };
        fileReader.readAsArrayBuffer(this.file);
    }

    async importValidation() {
        this.importEmployeeList.map(async (val, index) => {
            try {
                const value = await this.importSchema.validateAsync(val, {
                    abortEarly: false,
                });
                console.log(value);
            } catch (err) {
                const message = err.details.map(i => i.message).join(',');
                this.importEmployeeList[index].error = message;
                console.log('INDEX', index);
                this.isFileError = true;
                console.log(err);
            }
        });
    }
    handleExport() {
        const headings = [['Full Name', 'Roles', 'Email']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, this.employeeList, {
            origin: 'A2',
            skipHeader: true,
        });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'employee Report.xlsx');
    }

    openAddDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    /**
     * Toggle employee details
     *
     * @param employeeId
     */
    toggleDetails(employeeId: string): void {
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
        this._router.navigate(['/apps/employee/details/' + employeeId]);
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Create employee
     */
    createEmployee(): void {
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
    updateSelectedEmployee(): void {
        // Get the employee object
        const employee = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete employee.currentImageIndex;

        // Update the employee on the server
        this._employeeService
            .updateEmployee(employee.id, employee)
            .subscribe(() => {
                // Show a success message
                this.showFlashMessage('success');
            });
    }

    /**
     * Delete the selected employee using the form data
     */
    deleteSelectedEmployee(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete employee',
            message:
                'Are you sure you want to remove this employee? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the employee object
                const employee = this.selectedProductForm.getRawValue();

                // Delete the employee on the server
                this._employeeService
                    .deleteEmployee(employee.id)
                    .subscribe(() => {
                        // Close the details
                        this.closeDetails();
                    });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
