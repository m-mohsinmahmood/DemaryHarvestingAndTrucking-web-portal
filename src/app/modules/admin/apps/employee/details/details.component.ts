import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    Inject,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
    note: string;
    file: string;
}

const governmentDocs = [
    { id: '1', name: 'Passport', type: 'PDF' },
    { id: '2', name: 'Visa', type: 'DOC' },
    { id: '3', name: 'I-94', type: 'XLS' },
    { id: '4', name: 'License', type: 'TXT' },
    { id: '5', name: 'Social Security ', type: 'JPG' },
    { id: '6', name: 'DOT docs', type: 'DOC' },
    { id: '7', name: 'Physical', type: 'PDF' },
    { id: '8', name: 'Drug Testing', type: 'TXT' },
];
const companyDocs = [
    { id: '9', name: 'Drug Testing', type: 'TXT' },
    { id: '10', name: 'Contract', type: 'PDF' },
    { id: '11', name: 'Approval Letter', type: 'DOC' },
    { id: '12', name: 'Departure Form', type: 'JPG' },
    { id: '13', name: 'Equipment Usage', type: 'XLS' },
    { id: '14', name: 'Work Agreement', type: 'PDF' },
];

@Component({
    selector: 'employee-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {

    //#region  Observables
    employee$: Observable<any>;
    isLoadingEmployee$: Observable<any>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables
    isLoading: boolean = false;
    routeID; // URL ID
    employees: any;
    note: string;
    file: string;
    routes = [];
    employeeGovernemtDocs: any[] = governmentDocs;
    employeeCompanyDocs: any[] = companyDocs;
    // Sidebar stuff
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = "Employee Data";
    employee: any;

    //#endregion

    constructor(
        private _matDialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public _employeeService: EmployeeService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,

    ) { }

    //#region Life Cycle Hooks
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        })

        this.routes = this._employeeService.navigationLabels;
    }

    ngAfterViewInit(): void {
        this.initApis(this.routeID);
        this.initObservables();
        this.initSideNavigation();
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Initialize Observables
    initObservables() {
        // Data
        this.employee$ = this._employeeService.employee$;
        this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
        this.employee$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
            this.employee = res;
        });
        // Loader
    }
    //#endregion

    //#region Initial APIs
    initApis(id: string) {
        this._employeeService.getEmployeeById(id, 'false');
        this._employeeService.getEmployeeDocs(id);

    }
    //#endregion

    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._employeeService.navigationLabels;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    //#region Inner Navigation Routing
    routeHandler(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
            return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
    };

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    };
    //#endregion

    //#region Update Dialog
    openUploadDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UploadDocModal, {
            data: { name: this.note, animal: this.file },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.note = result;
        });
    }

    //#endregion

    backHandler(): void {
        this._router.navigate(['/apps/employee/']);
    }

}

@Component({
    selector: 'upload-doc-modal',
    templateUrl: 'upload-doc-modal.html',
})
export class UploadDocModal {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<UploadDocModal>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            file: ['', [Validators.required]],
            note: ['', [Validators.required]],
        });
    }

    onSubmit(): void { }

    discard(): void {
        // Close the dialog
        this.dialogRef.close();
    }
}
