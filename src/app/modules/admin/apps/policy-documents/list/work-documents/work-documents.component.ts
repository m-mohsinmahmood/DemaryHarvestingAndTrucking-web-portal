import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { PolicyDocumentsService } from '../../policy-documents.service';
import { UploadPolicyDocumentComponent } from '../upload-policy-document/upload-policy-document.component';

@Component({
  selector: 'app-work-documents',
  templateUrl: './work-documents.component.html',
  styleUrls: ['./work-documents.component.scss']
})
export class WorkDocumentsComponent implements OnInit {
  routeID: any;
  workDocument$: Observable<any>;
  policyDocuments: any[] = [
    { value: 'doc 1 ' },
    { value: 'doc 2' },
  ];

  constructor(
    private _policyDocumentService: PolicyDocumentsService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initObservable();
  }

  // #region Init Api's
  initObservable(): void {
    // Get Documents
    this.workDocument$ = this._policyDocumentService.policyDocuments$;
  }
  //#endregion

   //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadPolicyDocumentComponent, {
      data : {
        category: 'work',
        policyDocuments: this.policyDocuments
      }
      
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
        title: 'Work Document',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult)
        this._policyDocumentService.deletePolicyDocument(id,'work');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}
