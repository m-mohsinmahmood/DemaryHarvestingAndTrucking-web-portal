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
    Observable,
    Subject,
    Subscription,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import {
    EmployeePagination,
    Employee,
} from 'app/modules/admin/apps/employee/employee.types';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import * as Joi from 'joi';
import { countryList } from './../../../../../../JSON/country';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';


@Component({
    selector: 'app-employee',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
    
    //#region observable
    employeeList$: Observable<Employee[]>;
    employee$: Observable<Employee[]>;
    isLoadingEmployeeList$: Observable<boolean>;
    isLoadingEmployee$: Observable<boolean>;
    //#endregion

    //#region variables
    page: number = 1;
    pageSize = 200;
    pageSizeOptions: number[] = [50, 100, 150, 200,250,300,350,500];
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

    status_step = {
        "2":  "Account Activated",
        "3":  "Admin sending email to upload PP, DL, and SS docs",
        "4":  "Passport and Drivers License verified",
        "5":  "CDL training instructions posted",
        "6":  "CDL training instructions verified",
        "7":  "Compliance docs posted",
        "8":  "Compliance docs verified",
        "9":  "Employee Contract posted",
        "10": "Employee Contract verified",
        "11": "Bank account information requested",
        "12": "Bank account details verified",
        "13": "Visa Application Instructions posted",
        "14": "VISA Interview Date and Consulate Details verified",
        "15": "Approval Letter posted",
        "16": "Approval Letter verified",
        "17": "Waiting for VISA verification",
        "18": "VISA is verified",
        "19": "Waiting for further H2A required documentation",
        "20": "Additional H2A documentation verified",
        "21": "Social Security Card posted",
        "22": "Social Security Card verified",
        "23": "American and CDL (if applicable) Drivers license posted ",
        "24": "Onboarding completed",
        "25": "Onboarding completed",
    };

    constructor(
        private _router: Router,
        private _employeeService: EmployeeService,
        private _matDialog: MatDialog
    ) { }

   
    //#region LifeCycle Hooks
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
                    this.page,
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

     //#region Confirmation Customer Crops Delete Dialog
     confirmDeleteDialog(id: string , fb_id: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Employee?',
                title: 'Employee',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult)
                this._employeeService.deleteEmployee(id, fb_id, this.page, this.pageSize);
        });
    }
    //#endregion
    getCountryCode(country_code){
        if (country_code && country_code != 'zz')
        return  '+' + country_code?.split("+")[1];
    }
    getStatusCode(status_step){
        return this.status_step[status_step];
    }

}



