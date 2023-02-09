import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from '../compose/compose.component';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { EmployeeService } from '../../../employee.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding-status-bar',
  templateUrl: './onboarding-status-bar.component.html',
  styleUrls: ['./onboarding-status-bar.component.scss']
})
export class OnboardingStatusBarComponent implements OnInit {
  @Input() employee: any
  results: string[] = ['Active', 'In-process', 'Inactive'];
  automatedEmailForm: FormGroup;
  form: FormGroup;
  routeID; // URL ID
  email: any;
  statusBarDocs: any[] = ['','','driver_license_ss_card', 'compliance_docs', 'contract_created', 'contract_w4', 'bank_account', 'additional_compliance_docs'];



  constructor(
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getRouteParams();
    this.initForm();
    this.initEmployeeDocForm();
    this.email = {
      email: this.employee?.employee_info.email,
      subject: 'Document Rejection',
      emailBody: 'Dear ' + this.employee.employee_info.first_name + ',</br> I regret to inform you that the document you submitted has been rejected due to incorrect information. In order for your submission to be considered, please upload a revised document with the correct information.</br>Please ensure that all required information is included and that all data is accurate before resubmitting. If you have any questions or need assistance, please do not hesitate to contact us.</br>Thank you for your understanding and cooperation.</br>Best regards,</br> Admin.' 
    }
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

  //#region Init Form
  initEmployeeDocForm() {
    this.form = this._formBuilder.group({
      passport_country: [''],
      passport_number: [''],
      passport_expiration_date: [''],
      passport_doc: [''],
      passport_sign: [''],
      passport_disclaimer: [''],

      approval_letter_date: [''],
      approval_letter_doc: [''],
      approval_letter_sign: [''],
      approval_letter_disclaimer: [''],

      contract_date: [''],
      contract_doc: [''],
      contract_sign: [''],
      contract_disclaimer: [''],

      b797_date: [''],
      b797_expiration_date: [''],
      b797_doc: [''],
      b797_sign: [''],
      b797_disclaimer: [''],

      dot_physical_name: [''],
      dot_physical_expiration_date: [''],
      dot_physical_issue_date: [''],
      dot_physical_doc: [''],
      dot_physical_sign: [''],
      dot_physical_disclaimer: [''],

      drug_test_name: [''],
      drug_test_expiration_date: [''],
      drug_test_issue_date: [''],
      drug_test_doc: [''],
      drug_test_sign: [''],
      drug_test_disclaimer: [''],

      auto_license_state: [''],
      auto_license_number: [''],
      auto_license_expiration_date: [''],
      auto_license_issue_date: [''],
      auto_license_doc: [''],
      auto_license_sign: [''],
      auto_license_disclaimer: [''],

      cdl_license_state: [''],
      cdl_license_number: [''],
      cdl_license_issue_date: [''],
      cdl_license_doc: [''],
      cdl_license_sign: [''],
      cdl_license_disclaimer: [''],

      bank_acc_name: [''],
      bank_acc_routing: [''],
      bank_acc_account: [''],
      bank_acc_doc: [''],
      bank_acc_sign: [''],
      bank_acc_disclaimer: [''],

      w4_name: [''],
      w4_doc: [''],
      w4_sign: [''],
      w4_disclaimer: [''],

      social_sec_number: [''],
      social_sec_name: [''],
      social_sec_doc: [''],
      social_sec_sign: [''],
      social_sec_disclaimer: [''],

      work_agreement_date: [''],
      work_agreement_doc: [''],
      work_agreement_sign: [''],
      work_agreement_disclaimer: [''],

      itinerary_date: [''],
      itinerary_doc: [''],
      itinerary_sign: [''],
      itinerary_disclaimer: [''],

      visa_control_number: [''],
      visa_issue_date: [''],
      visa_expiration_date: [''],
      visa_nationality: [''],
      visa_red_stamped_no: [''],
      visa_issue_post: [''],
      visa_doc: [''],
      visa_sign: [''],
      visa_disclaimer: [''],

      i9_date: [''],
      i9_doc: [''],
      i9_sign: [''],
      i9_disclaimer: [''],

      i94_date: [''],
      i94_doc: [''],
      i94_sign: [''],
      i94_disclaimer: [''],

      cert_arrival_date: [''],
      cert_first_day: [''],
      cert_doc: [''],
      cert_sign: [''],
      cert_disclaimer: [''],

      department_last_day: [''],
      department_departure_date: [''],
      department_doc: [''],
      department_sign: [''],
      department_disclaimer: [''],

      handbook_date: [''],
      handbook_doc: [''],
      handbook_sign: [''],
      handbook_disclaimer: [''],

      rules_date: [''],
      rules_doc: [''],
      rules_sign: [''],
      rules_disclaimer: [''],

      drug_policy_date: [''],
      drug_policy_doc: [''],
      drug_policy_sign: [''],
      drug_policy_disclaimer: [''],

      reprimand_policy_date: [''],
      reprimand_policy_doc: [''],
      reprimand_policy_sign: [''],
      reprimand_policy_disclaimer: [''],

      departure_date: [''],
      departure_doc: [''],
      departure_sign: [''],
      departure_disclaimer: [''],

    });
  }
  //#endregion

   //#region route params function
   getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
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
  verifyDocs(index, type, statusBar: string) {
    const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
      data: {
        message: type === "Accept" ? "Are you sure you want to verify this document?" : "Are you sure you want to reject this document?",
        title: type === "Accept" ? "Verify Document" : "Reject Document",
        hideDeleteIcon: true,
        deleteText: type === "Accept" ? "Verify" : "Reject"
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true && type === 'Accept') {
        this._employeeService.patchEmployee({
          id: this.employee?.employee_info.employee_id,
          prev_status_step: this.employee?.employee_info.status_step,
          prev_status_message: this.employee?.employee_info.status_message,
          status_message: "Verified",
          status_step: +this.employee?.employee_info.status_step + 1,
        },this.employee?.employee_info?.country == 'United States of America'? 'false' : 'true');
      }
      else if (dialogResult === true && type === 'Reject') {
        var formData: FormData = new FormData();
        formData.append('form',JSON.stringify(this.form.value) );
        formData.append('doc_status', 'Reject');
        formData.append('employeeId', this.routeID);
        formData.append('docName', statusBar);
        formData.append('statusBarDoc', statusBar);
        formData.append('email', this.email.email);
        formData.append('subject', this.email.subject);
        formData.append('emailBody', this.email.emailBody);
        formData.append('h2a', this.employee?.employee_info?.country == 'United States of America'? 'false' : 'true');
        this._employeeService.patchEmployeeDocuments(this.routeID, formData);
        this._employeeService.patchEmployee({
          id: this.employee?.employee_info.employee_id,
          prev_status_step: this.employee?.employee_info.status_step,
          prev_status_message: this.employee?.employee_info.prev_status_message,
          status_message: "Inprogress",
          status_step: +this.employee?.employee_info.status_step,
          rejected: true,
        },this.employee?.employee_info?.country == 'United States of America'? 'false' : 'true');

      }


    }
    );
  }



  //#endregion

}
