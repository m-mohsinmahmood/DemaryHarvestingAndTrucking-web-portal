import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDocumentComponent } from 'app/modules/admin/apps/employee/navigation/documents/upload-document/upload-document.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../../employee.service';

@Component({
  selector: 'app-work-documents',
  templateUrl: './work-documents.component.html',
  styleUrls: ['./work-documents.component.scss']
})
export class WorkDocumentsComponent implements OnInit {
  @Input() employeeId: string;
  workDocuments$: Observable<any[]>;

  policyDocuments: any[] = [
    { value: 'Equipment Log' },
    { value: 'Reprimand Log' },
    { value: 'Departure info' },

  ];

  constructor(
    private _employeeService: EmployeeService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initObservable();
  }

  // #region Init Api's
  initObservable(): void {
    // Get Documents
    this.workDocuments$ = this._employeeService.policyDocuments$;
  }
  //#endregion
  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadDocumentComponent, {
      data: {
        employeeId: this.employeeId,
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
        this._employeeService.deletePolicyDocument(id, this.employeeId, 'work');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}
