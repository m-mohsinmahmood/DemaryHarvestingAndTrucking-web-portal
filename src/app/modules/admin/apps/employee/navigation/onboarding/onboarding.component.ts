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
  items = [];
  folders = [];
  block: any;
  routeID; // URL ID
  statusStep: string = '2';
  statusMessage: string = 'Application Submitted';
  preliminaryReviewForm: FormGroup;
  interviewCompletedForm: FormGroup;
  decisionMadeForm: FormGroup;
  employee: any;
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
    this.initApi();
    this.initObservables();
    
    this.items = [
      { content: 'Applicant accepts offer', name: '', date: '15/02/2022', status: 'a', active: true },
      { content: 'Applicant to set up a new DHT Account', name: 'Bethnay Blake', date: '15/02/2022', status: 'b', active: false },
      { content: 'Activate the Applicants Account', name: 'Bethnay Blake', date: '15/02/2022', status: 'd1', active: false },
      { content: 'Automated email for the following:​', name: 'Bethnay Blake', date: '15/02/2022', status: 'd1', active: false },
      { content: 'US Applicants upload Drivers License and SS Card', name: 'Bethnay Blake', date: '15/02/2022', status: 'd1', active: false },
      { content: 'H2A upload Passport and Foreign Drivers License', name: 'Katherine synder', date: '15/02/2022', status: 'e2', active: false },
      { content: 'Pictures Readable and complete?', name: 'Bill Demaray', date: '15/02/2022', status: 'e1', active: false },
      { content: 'Applicant to review/sign Compliance docs & notify Admin.', name: '', date: '15/02/2022', status: 'e1', active: false },
      { content: 'Review/complete Visa app (foreign applicant only)', name: '', date: '15/02/2022', status: 'e1', active: false },
      { content: 'Notify & initiate final step before hiring', name: '', date: '15/02/2022', status: 'e1', active: false },
      { content: 'Create and send final 2 docs prior to hiring', name: '', date: '15/02/2022', status: 'e2', active: false },
      { content: 'Travel arrangements and apply for online bank account', name: '', date: '15/02/2022', status: 'e2', active: false },
      { content: 'Walk through remaining documents​', name: '', date: '15/02/2022', status: 'e2', active: false },
      { content: 'officially begin his/her job and start payroll​', name: '', date: '15/02/2022', status: 'e2', active: false },



    ];
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



    this.folders = [
      { folder: 'DOI' },
      { folder: 'DOT' },
      { folder: 'Payroll' },
      { folder: 'DHS' },
      { folder: 'Documents' },
    ];
    // on page rending of Folder
    this.block = 'DOI';
  }

  //#region Get Applicant By id 
  initApi() {
    this._employeeService.getEmployeeById(this.routeID);
    this._employeeService.getEmployeeDocs(this.routeID);
  }
  //#endregion

  //#region Initilize Observables 
  initObservables(){
    this.employeeDocs$ = this._employeeService.employeeDocuments$
    this.employee$ = this._employeeService.employee$;
    this.employee$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      this.employee = res;
    });
  }
  //#endregion

  //#region route params function
  getRouteParams(){
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

  downloadDocument(doc){
    window.open(doc, "_blank");
  }

  

}