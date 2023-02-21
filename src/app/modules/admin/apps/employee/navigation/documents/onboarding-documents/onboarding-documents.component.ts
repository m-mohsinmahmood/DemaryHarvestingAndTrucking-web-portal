import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDocumentComponent } from 'app/modules/admin/apps/employee/navigation/documents/upload-document/upload-document.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../../employee.service';

@Component({
  selector: 'app-onboarding-documents',
  templateUrl: './onboarding-documents.component.html',
  styleUrls: ['./onboarding-documents.component.scss']
})
export class OnboardingDocumentsComponent implements OnInit {

  @Input() onboardingDocuments: Observable<any>;
  @Input() employeeId: any;
  policyDocument$: Observable<any[]>;

  policyDocuments: any[] = [
    { value: 'Passport' },
    { value: 'Foreign Drivers License' },
    { value: 'Contract' },
    { value: 'Approval Letter' },
    { value: 'VISA' },
    { value: 'Social Security' },
    { value: 'W-4 (USA only)' },
    { value: 'American Drivers License' },
    { value: 'CDL Drivers License' },
    { value: 'E-verify' },
    { value: 'I-90' },
    { value: 'I-94' },
    { value: 'Physical Test' },
    { value: 'Drug Test' },
  ];


  constructor(
    private _employeeService: EmployeeService,
    private _matDialog: MatDialog,
  ) { }


  ngOnInit(): void {
  }

  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadDocumentComponent, {
      data: {
        employeeId: this.employeeId,
        category: 'onboarding',
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
        title: 'Onboarding Document',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult)
        this._employeeService.deletePolicyDocument(id, this.employeeId, 'onboarding');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}
