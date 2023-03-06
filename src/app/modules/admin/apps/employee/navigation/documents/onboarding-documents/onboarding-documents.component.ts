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
  @Input() employeeDocs: Observable<any>;
  @Input() employeeId: any;
  policyDocument$: Observable<any[]>;
  filteredEmployeeDocs= <any>{} ;
  employeeDocsName = {
    "passport_doc": "Passport",
    "dot_physical_doc": "DOT Physical",
    "drug_test_doc": "Drug Test",
    "cdl_license_doc": "State/CDL Driver License",
    "visa_doc": "VISA",
    "i9_doc": "I-9",
    "i94_doc": "I-94",
    "cert_doc": "E - Verify Cert",
    "bank_acc_doc": "Bank Account",
    "social_sec_doc": "Social Security",
    "w4_doc": "W-4",
    "foreign_driver_license_doc": "Foreign Driver License",
    "american_license_doc": "American/CDL License"
  }
  

  policyDocuments: any[] = [
    { value: 'Contract' },
    { value: 'Approval Letter' },
    { value: 'Social Security' },
    { value: 'W-4 (USA only)' },
  ];


  constructor(
    private _employeeService: EmployeeService,
    private _matDialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.displayEmployeeDocs();
  }

  displayEmployeeDocs(){
    for (const [key, value] of Object.entries(this.employeeDocs)) {
      for (const [key, val] of Object.entries(value)) {
        if (key.includes('doc') && val){
            this.filteredEmployeeDocs[key] = val;
        }
      }
    }
    console.log(this.filteredEmployeeDocs);
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
