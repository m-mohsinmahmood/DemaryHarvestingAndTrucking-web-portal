import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { Subject, takeUntil } from 'rxjs';
import { Documents, Item } from '../../employee.types';

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

    constructor(
        private _employeeService: EmployeeService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        this.initApis();

        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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
    getFiles(id: any): void{
        this.activeID = id;
        this._employeeService.getItems(id).subscribe((a) => {});
    }
   // #region Init Api's
    initApis(): void {
        // Get the items
        this._employeeService.documents$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((documents: Documents) => {
                this.documents = documents;
                if (this.documents.files.length < 1) {
                    this.getFiles(this.documents.folders[0].id);
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._employeeService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    //#endregion
}
