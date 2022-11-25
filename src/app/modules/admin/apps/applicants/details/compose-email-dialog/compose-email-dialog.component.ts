import { Component, Inject, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { ApplicantService } from '../../applicants.services';


@Component({
  selector: 'app-compose-email-dialog',
  templateUrl: './compose-email-dialog.component.html',
  styleUrls: ['./compose-email-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class ComposeEmailDialogComponent implements OnInit, AfterViewInit {


  //#region email variables
  emails: any;
  formValid: boolean;
  copyFields: { cc: boolean; bcc: boolean } = {
    cc: false,
    bcc: false
  };
  quillModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };
  //#endregion
  //#region Auto Complete Farms
  allRecruiters: Observable<any>;
  recruiter_search$ = new Subject();
  //#endregion

  //#region variables
  isReferenceCall = false;
  selectedRecruiterCalendly: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    public matDialogRef: MatDialogRef<ComposeEmailDialogComponent>,
    private _applicantService: ApplicantService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  //#region Lifecycle hooks
  ngOnInit(): void {
    this.emails = [
      { id: '1', subject: 'DHT Employment Application Received!', email: 'Dear ' + this.data.applicant.first_name + ',</br> Thank you for your completing DHT’s online application.  We are currently reviewing your application and will be reaching out soon with further instructions on next steps Thanks,' },
      { id: '2', subject: 'DHT Interview Request', email: 'Dear ' + this.data.applicant.first_name + ',</br>We are pleased  to inform you that DHT is interested in scheduling an interview to learn more about you.  We would ask that you please click the link below to schedule a day/time that works best for you to speak with one of our company representatives.</br>Kind regards,' },
      { id: '3', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>Thank you for your completing DHT’s online application.  We have had a significant number of online applications this year and have offered all currently available positions to other candidates.  However, if you are interested, we have a waiting list that has been created to fill positions of applicants that are not able to complete the employment process.  If you are interested in being placed on this list, please email Matt Demaray at Matt@DHT-USA.com.</br>Kind regards,' },
      { id: '4', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>Thank you for your completing DHT’s online application, but at present your qualifications do not match any currently available positions at DHT.  We will keep your application on file should any new opportunities arise.</br>Kind regards,' },
      { id: '5', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT and are pleased to inform you that someone from DHT will soon be reaching out to speak with your references.  Upon completion, you will be promptly notified to discuss next steps and answer any questions you may have.</br>Kind regards,' },
      { id: '6', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  We have had a significant number of online applications this year and unfortunately, have offered all currently available positions to other candidates.  However, if you are interested, we have a waiting list that has been created to fill positions of applicants that are not able to complete the employment process.  If you are interested in being placed on this list, please email Matt Demaray at Matt@DHT-USA.com.</br>Kind regards,' },
      { id: '7', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we feel that your qualifications do not currently match any available positions at DHT.  We will keep your application on file should any new opportunities arise.' },
      { id: '8', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we are excited to inform you that DHT has decided to offer you a position as a [insert position they selected from drop down list].  DHT’s Administrative Director, Bill Demaray, will be contacting you shortly by email to discuss the required pre-employment (onboarding) enrollment steps. We look forward to meeting and working with you soon.' },
      { id: '9', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we feel that your qualifications do not currently match any available positions at DHT.  We will keep your application on file should any new opportunities arise.' },
    ];
    const statusBar = [
      { id: 1, status: false, statusStep: '1', statusMessage: 'Applicant completed' },
      { id: 2, status: false, statusStep: '2', statusMessage: 'Advance Preliminary review' },
      { id: 3, status: false, statusStep: '4', statusMessage: 'First interview completed' },
      { id: 4, status: false, statusStep: '5', statusMessage: 'Second interview completed' },
      { id: 5, status: false, statusStep: '6', statusMessage: 'Third interview completed' },
      { id: 6, status: false, statusStep: '7', statusMessage: 'Reference call completed' },
      { id: 7, status: false, statusStep: '8', statusMessage: 'Recruiter decision made' },
      { id: 8, status: false, statusStep: '9', statusMessage: 'Offer made' },
      { id: 9, status: false, statusStep: '10', statusMessage: 'Offer accepted' },
      { id: 10, status: false, statusStep: '11', statusMessage: 'Advance to pre-employement process' },
      { id: 11, status: false, statusStep: '12', statusMessage: 'Not qualified' },
      { id: 12, status: false, statusStep: '13', statusMessage: 'Reconsider in future' },
    ]
    this.patchForm();
  }

  ngAfterViewInit() { }

  ngDoCheck() {
    if (this.data.preliminaryReview) {
      if (this.data?.form?.controls['status_message'].value == 'advance') {
        this.data.form.controls['recruiter_id'].enable();
        this.data.form.controls['recruiter_id'].value = '';
        this.data.form.patchValue({
          subject: this.emails[1].subject,
          body: this.emails[1].email
        })
      }
      else if (this.data.form.controls['status_message'].value == 'wait-listed') {
        this.data?.form?.controls['recruiter_id'].enable();
        this.data.form.controls['recruiter_id'].value = '';
        this.data.form.patchValue({
          subject: this.emails[2].subject,
          body: this.emails[2].email
        })
      }
      else if (this.data?.form?.controls['status_message'].value == 'not-qualified') {
        this.data.form.controls['recruiter_id'].enable();
        this.data.form.controls['recruiter_id'].value = '';
        this.data.form.patchValue({
          subject: this.emails[3].subject,
          body: this.emails[3].email
        })
      }
    }
    if (this.data.interviewCompletedForm) {
      if (this.data?.form?.controls['status_message'].value == 'reference_call') {
        this.data.form.patchValue({
          subject: this.emails[4].subject,
          body: this.emails[4].email,
          status_step: '6',
        })
        this.data.form.controls['recruiter_id'].enable();
        this.isReferenceCall = true;
      }
      else if (this.data?.form?.controls['status_message'].value == 'second_interview') {
        this.data.form.patchValue({
          subject: this.emails[1].subject,
          body: this.emails[1].email,
          status_step: '4',
        })
        this.data.form.controls['recruiter_id'].enable();
      }
      else if (this.data?.form?.controls['status_message'].value == 'third_interview') {
        this.data.form.patchValue({
          subject: this.emails[1].subject,
          body: this.emails[1].email,
          status_step: '5',
        })
        this.data.form.controls['recruiter_id'].enable();
      }
      else if (this.data?.form?.controls['status_message'].value == 'wait_listed') {
        this.data.form.patchValue({
          subject: this.emails[5].subject,
          body: this.emails[5].email,
          status_step: '6',
        })
        this.data.form.controls['recruiter_id'].disable();
      }
      else if (this.data.form.controls['status_message'].value == 'not_qualified') {
        this.data.form.patchValue({
          subject: this.emails[6].subject,
          body: this.emails[6].email,
          status_step: '6',
        })
        this.data.form.controls['recruiter_id'].disable();
      }
    }
    if (this.data.decisionMadeForm) {
      if (this.data?.form?.controls['status_message'].value == 'offer') {
        this.data.form.patchValue({
          subject: this.emails[7].subject,
          body: this.emails[7].email,
          status_step: '8',
        })
      }
      if (this.data?.form?.controls['status_message'].value == 'not_qualified') {
        this.data.form.patchValue({
          subject: this.emails[8].subject,
          body: this.emails[8].email
        })
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region Patch form 
  patchForm() {
    const { applicant } = this.data;
    this.data.form.patchValue({
      to: applicant.email,
      id: applicant.id,
    });
  }

  //#region Public Methods
  showCopyField(name: string): void {
    // Return if the name is not one of the available names
    if (name !== 'cc' && name !== 'bcc') {
      return;
    }
    // Show the field
    this.copyFields[name] = true;
  }

  //#endregion

  //#region Form Methods
  discard(): void {
    this.matDialogRef.close();
    this.data.form?.controls['recruiter_id']?.disable();
    this.data.form.reset();
  }

  send(): void {
    this._applicantService.patchApplicant(this.data.form.value);
    this.matDialogRef.close();
    this.data.form.controls['recruiter_id'].disable();
    this.data.form.reset();
  }

  //#endregion
  //#region Select Recruiter Calendly link
  recruiterSelect(recruiter: any) {
    if (this.data.preliminaryReview) {
      if (this.data?.form?.controls['status_message'].value == 'advance') {
        if (this.emails[1].email.includes('&#8205')) {
          this.changeCalendlyLink(recruiter, 1);
        }
        else {
          this.emails[1].email = this.emails[1].email + '&#8205';
          this.emails[1].email = this.emails[1].email + `</br>${recruiter.calendly}`;
        }
      }
      if (this.data?.form?.controls['status_message'].value == 'wait-listed') {
        if (this.emails[2].email.includes('&#8205')) {
          this.changeCalendlyLink(recruiter, 2);
        }
        else {
          this.emails[2].email = this.emails[2].email + '&#8205';
          this.emails[2].email = this.emails[2].email + `</br>${recruiter.calendly}`;
        }
      }
      if (this.data?.form?.controls['status_message'].value == 'not-qualified') {
        if (this.emails[3].email.includes('&#8205')) {
          this.changeCalendlyLink(recruiter, 3);
        }
        else {
          this.emails[3].email = this.emails[3].email + '&#8205';
          this.emails[3].email = this.emails[3].email + `</br>${recruiter.calendly}`;
        }
      }
    }
    if (this.data.interviewCompletedForm) {
      if (this.data?.form.controls['status_message'].value == 'second_interview' || this.data?.form.controls['status_message'].value == 'third_interview') {
        if (this.emails[1].email.includes('&#8205')) {
          this.changeCalendlyLink(recruiter, 1);
        }
        else {
          this.emails[1].email = this.emails[1].email + '&#8205';
          this.emails[1].email = this.emails[1].email + `</br>${recruiter.calendly}`;
        }
      }
      if (this.data?.form.controls['status_message'].value == 'reference_call') {
        if (this.emails[4].email.includes('&#8205')) {
          this.changeCalendlyLink(recruiter, 4);
        }
        else {
          this.emails[4].email = this.emails[4].email + '&#8205';
          this.emails[4].email = this.emails[4].email + `</br>${recruiter.calendly}`;
        }
      }
    }
  }

  changeCalendlyLink(recruiter: any, index) {
    const split = this.emails[index].email.split('</br>')
    split.pop();
    split.pop();
    split.pop();
    split.push(recruiter.calendly);
    this.emails[index].email = split.join('</br>');
  }
  //#endregion

  //#region Auto Complete
  getDropdownRecruiters() {
    let searchValue;
    typeof this.data.form.controls['recruiter_id'].value === 'object' ? (searchValue = this.data.form.controls['recruiter_id'].value?.name) : searchValue = this.data.form.controls['recruiter_id'].value;
    !searchValue ? searchValue = '' : '';
    this.allRecruiters = this._applicantService.getDropdownAllRecruiters(searchValue);
  }
  // Display Function
  displayRecruiterForAutoComplete(recruiter: any) {
    return recruiter ? `${recruiter.name}` : undefined;
  }

  // Search Function
  recruiterSearchSubscription() {
    this.recruiter_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allRecruiters = this._applicantService.getDropdownAllRecruiters(
          value
        );
      });
  }
  
  // Validation
  formValidation(e) {
    typeof (e) == 'string' ? (this.formValid = true) : (this.formValid = false)
  }
  //#endregion


}

