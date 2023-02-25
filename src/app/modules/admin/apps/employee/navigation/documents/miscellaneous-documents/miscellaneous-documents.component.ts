import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDocumentComponent } from 'app/modules/admin/apps/employee/navigation/documents/upload-document/upload-document.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../../employee.service';

@Component({
  selector: 'app-miscellaneous-documents',
  templateUrl: './miscellaneous-documents.component.html',
  styleUrls: ['./miscellaneous-documents.component.scss']
})
export class MiscellaneousDocumentsComponent implements OnInit {
  @Input() employeeId: string;
  miscellaneousDocument$: Observable<any[]>;
  policyDocuments: any[] = [
    { value: 'Private legal doc' },
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
    this.miscellaneousDocument$ = this._employeeService.policyDocuments$;
  }
  //#endregion

  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadDocumentComponent, {
      data: {
        employeeId: this.employeeId,
        category: 'miscellaneous',
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
        title: 'Miscellaneous Document',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult)
        this._employeeService.deletePolicyDocument(id, this.employeeId, 'miscellaneous');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}
