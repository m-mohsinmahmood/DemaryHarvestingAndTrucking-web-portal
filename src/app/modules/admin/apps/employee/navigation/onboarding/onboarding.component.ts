import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from './compose/compose.component';
import { EmployeeService } from '../../employee.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  //#region Variables
  folders: any  = [];
  block: string = '';
  routeID; // URL ID
  statusStep: string = '2';
  statusMessage: string = 'Application Submitted';
  preliminaryReviewForm: FormGroup;
  interviewCompletedForm: FormGroup;
  decisionMadeForm: FormGroup;
  employee: any;
  h2a: string;
  //#endregion

  //#region observables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  employee$: Observable<any>;
  employeeDocs$: Observable<any>;
  //#endregion

  constructor(
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
  ) { }

  //#region Lifecycle hooks

  ngOnInit(): void {
    this.getRouteParams();
    this.initObservables();
    this.initApi();

    this.preliminaryReviewForm = this._formBuilder.group({
      preliminary_review: [''],
      recruiter: [''],
      recruiter_id: [{ value: '', disabled: true }],
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.email]],
      bcc: ['', [Validators.email]],
      subject: [''],
      body: ['', [Validators.required]]
    });
    this.interviewCompletedForm = this._formBuilder.group({
      next_step: [''],
      preliminary_review: [''],
      recruiter: [''],
      recruiter_id: [{ value: '', disabled: true }],
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.email]],
      bcc: ['', [Validators.email]],
      subject: [''],
      body: ['', [Validators.required]]
    });
    this.decisionMadeForm = this._formBuilder.group({
      next_step: [''],
      to: ['', [Validators.required, Validators.email]],
      cc: ['', [Validators.email]],
      bcc: ['', [Validators.email]],
      subject: [''],
      body: ['', [Validators.required]]
    });

    this.folders = this.employee?.employee_info.country == 'United States of America'? [
      { folder: 'Department of Transportation (DOT)' },
      { folder: 'Payroll' },
      { folder: 'Department of Labor (DOL)' },
      { folder: 'DHT Onboarding Documents' },
    ]:[
      { folder: 'Department of Immigration (DOI)' },
      { folder: 'Department of Transportation (DOT)' },
      { folder: 'Payroll' },
      { folder: 'Department of Labor (DOL)' },
      { folder: 'DHT Onboarding Documents' },
    ]
    this.employee?.employee_info.country == 'United States of America'? this.block = 'Department of Transportation (DOT)' : this.block =  'Department of Immigration (DOI)'
  }

  //#region Get Applicant By id 
  initApi() {
    this._employeeService.getEmployeeDocs(this.routeID);
  }
  //#endregion

  //#region Initilize Observables 
  async initObservables() {
    this.employeeDocs$ = this._employeeService.employeeDocuments$
    this.employee$ = this._employeeService.employee$;
    await this.employee$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      this.employee = res;
      this.employee?.employee_info?.country == 'United States of America' ? this.h2a = 'false' : this.h2a = 'true';
    });
    this._employeeService.getEmployeeById(this.routeID, this.h2a);

  }
  //#endregion

  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion

  //#region Compose Email

  openComposeDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(MailboxComposeComponent);

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
      });
  }
  //#endregion


  onClick(foldename: any) {
    this.block = foldename.folder;
  }

  downloadDocument(doc) {
    window.open(doc, "_blank");
  }



}