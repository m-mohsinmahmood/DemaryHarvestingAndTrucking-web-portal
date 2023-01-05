import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from '../compose/compose.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { EmployeeService } from '../../../employee.service';

@Component({
  selector: 'app-onboarding-status-bar',
  templateUrl: './onboarding-status-bar.component.html',
  styleUrls: ['./onboarding-status-bar.component.scss']
})
export class OnboardingStatusBarComponent implements OnInit {
  @Input() employee: any
  results: string[] = ['Active', 'In-process', 'Inactive'];
  automatedEmailForm: FormGroup;

  constructor(
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,


  ) { }

  ngOnInit(): void {
    this.initForm();
  }


  //#region Init Form
  initForm() {
    this.automatedEmailForm = this._formBuilder.group({
      id: [''],
      status_message: ['', [Validators.required]],
      status_step: ['3'],
      prev_status_step: [''],
      prev_status_message: [''],
      to: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      subject: [''],
      body: ['', [Validators.required]],
    });




  }
  //#endregion


  //#region Status Bar onclick
  composeEmail(index) {
    const dialogRef = this._matDialog.open(MailboxComposeComponent, {
      data: {
        employee: this.employee.employee_info,
        form: this.automatedEmailForm,
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  //#endregion

  //#region Verify Docs
  verifyDocs(index, type) {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        message: type === "Accept" ? "Are you sure you want to verify this document?" : "Are you sure you want to put this Applicant in Rejected Offer list?",
        title: type === "Accept" ? "Verify Document" : "Offer Rejected",
        hideDeleteIcon: true,
        deleteText: type === "Accept" ? "Verify" : "Reject"
      },

    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this._employeeService.patchEmployee({
          id: this.employee?.employee_info.employee_id,
          prev_status_step: this.employee?.employee_info.status_step,
          prev_status_message: this.employee?.employee_info.status_message,
          status_message: "Verified",
          status_step: +this.employee?.employee_info.status_step + 1,
        }
        );
      }
      else if (dialogResult && type === "Reject") {

      }
    });
  }


  //#endregion

}
