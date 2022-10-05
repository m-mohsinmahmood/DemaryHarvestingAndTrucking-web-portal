import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    Inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { Employee } from 'app/modules/admin/apps/employee/employee.types';
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
    styles: [
        /* language=SCSS */
        `
            .employee-detail-grid {
                grid-template-columns: 10% 50% 30%;

                @screen sm {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen md {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen lg {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID
    employees: any;
    note: string;
    file: string;
    routes = [];
    employeeGovernemtDocs: any[] = governmentDocs;
    employeeCompanyDocs: any[] = companyDocs;
    employee: Employee;

    // Sidebar stuff
      drawerMode: 'over' | 'side' = 'side';
      drawerOpened: boolean = true;
      selectedIndex: string = "Payroll";


    /*
    *
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _employeeService: EmployeeService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,

    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.routes = this._employeeService.navigationLabels;


        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        })

        // Get the employee by id
        this._employeeService
            .getEmployeeById(this.routeID)
            .subscribe((employee) => {
                this.employees = employee;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {

          // Set the drawerMode and drawerOpened if the given breakpoint is active
          if (matchingAliases.includes('lg')) {
            this.drawerMode = 'side';
            this.drawerOpened = true;
          }
          else {
            this.drawerMode = 'over';
            this.drawerOpened = false;
          }

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });
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

    navigationHandler(index) {
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

    openUpdateDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent, {
            data: { id: this.routeID },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

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
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            file: ['', [Validators.required]],
            note: ['', [Validators.required]],
        });
    }

    onSubmit(): void {}

    discard(): void {
        // Close the dialog
        this.dialogRef.close();
    }
}
