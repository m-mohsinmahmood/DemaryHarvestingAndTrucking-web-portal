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
import { countryList } from './../../../../../../JSON/country';

@Component({
    selector: 'app-employee',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
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
    countries: string[] = [];
    statusList: string[] = [
        'Hired',
        'Evaluated',
        'In-Process',
        'New',
        'N/A',
        'Not Being Considered',
    ];

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
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // passing country array
        this.countries = countryList;


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
        this._employeeService.getEmployees();
        this.employeesdata$ = this._employeeService.employeedata$;

        this.employeesdata$.subscribe((value) => {
            this.employeeList = value;
        });

        // Subscribe to search input field value changes
        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         switchMap((query) => {
        //             this.closeDetails();
        //             this.isLoading = true;
        //             return this._employeeService.getEmployees(
        //                 0,
        //                 10,
        //                 'name',
        //                 'asc',
        //                 query
        //             );
        //         }),
        //         map(() => {
        //             this.isLoading = false;
        //         })
        //     )
        //     .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
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
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = new Array();
            for (let i = 0; i != data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
            const bstr = arr.join('');
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const first_sheet_name = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[first_sheet_name];
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
            } catch (err) {
                const message = err.details.map(i => i.message).join(',');
                this.importEmployeeList[index].error = message;
                this.isFileError = true;
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

        dialogRef.afterClosed().subscribe((result) => { });
    }
    /**
     * Toggle employee details
     *
     * @param employeeId
     */
    toggleDetails(employeeId: string): void {
        this._router.navigate(['/apps/employee/details/' + employeeId]);
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    createEmployee(): void {
        // Create the employee
        // this._employeeService.createEmployee().subscribe((newEmployee) => {
        //     // Go to new employee
        //     this.selectedProduct = newEmployee;

        //     // Fill the form
        //     this.selectedProductForm.patchValue(newEmployee);

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
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



