import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { PolicyDocumentsService } from '../../policy-documents.service';
import { UploadPolicyDocumentComponent } from '../upload-policy-document/upload-policy-document.component';

@Component({
  selector: 'app-employment-period-documents',
  templateUrl: './employment-period-documents.component.html',
  styleUrls: ['./employment-period-documents.component.scss']
})
export class EmploymentPeriodDocumentsComponent implements OnInit {

  // @Input() onboardingDocuments: Observable<any>;
  employmentPeriodDocument$: Observable<any[]>;

  policyDocuments: any[] = [
    { value: 'Ag Work Agreement First Employment Period' },
    { value: 'Ag Work Agreement Second Employment Period' },
    { value: 'Work Itinerary First Employment Period' },
    { value: 'Work Itinerary Second Employment Period' },
    { value: 'I-797B First Employment Period' },
    { value: 'I-797B Second Employment Period' },  
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
    this.employmentPeriodDocument$ = this._policyDocumentService.policyDocuments$;
  }
  //#endregion

  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadPolicyDocumentComponent, {
      data: {
        category: 'employment_period',
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
        this._policyDocumentService.deletePolicyDocument(id, 'employment_period');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}