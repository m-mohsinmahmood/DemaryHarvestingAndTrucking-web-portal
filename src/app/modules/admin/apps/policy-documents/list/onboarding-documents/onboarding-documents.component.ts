import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { PolicyDocumentsService } from '../../policy-documents.service';
import { UploadPolicyDocumentComponent } from '../upload-policy-document/upload-policy-document.component';

@Component({
  selector: 'app-onboarding-documents',
  templateUrl: './onboarding-documents.component.html',
  styleUrls: ['./onboarding-documents.component.scss']
})
export class OnboardingDocumentsComponent implements OnInit {

  @Input() onboardingDocuments: Observable<any>;
  policyDocument$: Observable<any[]>;

  policyDocuments: any[] = [
    { value: 'Employee Handbook' },
    { value: 'Dht Work Rules' },
    { value: 'Drug Policy' },
    { value: 'Reprimand Policy' },
    { value: 'Departure Policy' },
    { value: 'Equipment Policy' },
    { value: 'Cdl Training Instructions' },
    { value: 'VISA Application Instructions' },
  ];


  constructor(
    private _policyDocument: PolicyDocumentsService,
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,
  ) { }


  ngOnInit(): void {
  }


  //#region Upload Document Popup
  uploadDocument() {
    const dialogRef = this._matDialog.open(UploadPolicyDocumentComponent, {
      data : {
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
        this._policyDocument.deletePolicyDocument(id,'onboarding');
    });
  }

  //#endregion

  //#region Download Document
  downloadDocument(url) {
    window.open(url, "_blank");
  }
  //#endregion

}
