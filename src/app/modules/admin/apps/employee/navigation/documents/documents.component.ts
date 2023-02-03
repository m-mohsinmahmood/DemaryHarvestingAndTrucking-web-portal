import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Documents, Item } from '../../employee.types';
import { UploadDocumentComponent } from './upload-document/upload-document.component';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    documents: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    activeID: any;
    policyDocument$: Observable<any[]>;

    constructor(
        private _employeeService: EmployeeService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,

    ) {}

    ngOnInit(): void {
        this.initApis();
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
   
   // #region Init Api's
    initApis(): void {
        // Get Documents
        this.policyDocument$ = this._employeeService.policyDocuments$;
        this._employeeService.getPolicyDocuments();
    }
    //#endregion
    
    //#region Upload Document Popup
    uploadDocument(){
        const dialogRef = this._matDialog.open(UploadDocumentComponent, {
            data: {},
          });
          dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
          });
    }

    //#endregion
}
