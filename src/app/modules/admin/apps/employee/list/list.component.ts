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
    Subscription,
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

    //#region observable
    employeesdata$: Observable<Employee[]>;
    employeeList$: Observable<Employee[]>;
    employee$: Observable<Employee[]>;
    isLoadingEmployeeList$: Observable<boolean>;
    isLoadingEmployee$: Observable<boolean>;
    //#endregion


    //#region variables
    page: number;
    pageSize = 50;
    pageSizeOptions: number[] = [50, 100, 150, 200];
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    search: Subscription;
    searchResult: string;
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
    isLoading: boolean = false;
    pagination: EmployeePagination;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Import Validation
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
    //#endregion

    constructor(
        private _router: Router,
        private _employeeService: EmployeeService,
        private _matDialog: MatDialog
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    //#region life-cycle methods
    ngOnInit(): void {
        this.countries = countryList;
     
    }

    ngAfterViewInit(): void {
        this.initObservables();
        this.initApis();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //#endregion

    //#region Init Methods
    initObservables() {
        this.isLoadingEmployeeList$ = this._employeeService.isLoadingEmployeeList$;
        this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
        this.employeeList$ = this._employeeService.employeeList$;
        this.employee$ = this._employeeService.employee$;
        this.search = this.searchform.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((data) => {
                this.searchResult = data.search;
                this.page = 1;
                this._employeeService.getEmployees(
                    1,
                    this.pageSize,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    initApis() {
        this._employeeService.getEmployees();
    }
    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    //#region Import/Export
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
        // utils.sheet_add_json(ws, this.employeeList, {
        //     origin: 'A2',
        //     skipHeader: true,
        // });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'employee Report.xlsx');
    }

    //#endregion

    openEditDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddComponent);
        dialogRef.afterClosed().subscribe((result) => { });
    }

    //#region Sort Function
    sortData(sort: any) {
        this.page = 1;
        this._employeeService.getEmployees(
            this.page,
            this.pageSize,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }
    //#endregion

    //#region  Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this._employeeService.getEmployees(this.page, this.pageSize, '', '', this.searchResult);
    }
    //#endregion
    //#region open details
    toggleDetails(employeeId: string): void {
        this._router.navigate(['/apps/employee/details/' + employeeId]);
    }
    //#endregion


}



