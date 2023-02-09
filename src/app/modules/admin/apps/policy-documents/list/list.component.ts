import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PolicyDocumentsService } from '../policy-documents.service';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { UploadPolicyDocumentComponent } from '../list/upload-policy-document/upload-policy-document.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  documents: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  activeID: any;
  policyDocument$: Observable<any[]>;

  constructor(
    private _policyDocument: PolicyDocumentsService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _matDialog: MatDialog,

  ) { }

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
    this.policyDocument$ = this._policyDocument.policyDocuments$;
    this._policyDocument.getPolicyDocuments();
  }
  //#endregion

  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadPolicyDocumentComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }
  //#endregion

  //#region Delete confirmation
  confirmDeleteDialog(id: string): void {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this Document?',
        title: 'Policy Document',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult)
        this._policyDocument.deletePolicyDocument(id);
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion
}
