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
  reason_for_rejection = false;
  //#endregion

  //#region Status Bar Variables
  current_status_step;
  current_status_message;
  next_status_step;
  next_status_message;
  //#endregion

  //#region Form Helper
  email_text: string;
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
      { id: '2', subject: 'DHT Interview Request', email: 'Dear ' + this.data.applicant.first_name + ',</br>We are pleased  to inform you that DHT is interested in scheduling an interview to learn more about you.  We would ask that you please click the link below to schedule a day/time that works best for you to speak with one of our company representatives.</br></br>Kind regards,</br>' },
      { id: '3', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>Thank you for your completing DHT’s online application.  We have had a significant number of online applications this year and have offered all currently available positions to other candidates.  However, if you are interested, we have a waiting list that has been created to fill positions of applicants that are not able to complete the employment process.  If you are interested in being placed on this list, please email Matt Demaray at Matt@DHT-USA.com.</br></br>Kind regards,</br>' },
      { id: '4', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>Thank you for your completing DHT’s online application, but at present your qualifications do not match any currently available positions at DHT.  We will keep your application on file should any new opportunities arise.</br></br>Kind regards,</br>' },
      { id: '5', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT and are pleased to inform you that someone from DHT will soon be reaching out to speak with your references.  Upon completion, you will be promptly notified to discuss next steps and answer any questions you may have.</br></br>Kind regards,</br>' },
      { id: '6', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  We have had a significant number of online applications this year and unfortunately, have offered all currently available positions to other candidates.  However, if you are interested, we have a waiting list that has been created to fill positions of applicants that are not able to complete the employment process.  If you are interested in being placed on this list, please email Matt Demaray at Matt@DHT-USA.com.</br></br>Kind regards,</br>' },
      { id: '7', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we feel that your qualifications do not currently match any available positions at DHT.  We will keep your application on file should any new opportunities arise.' },
      { id: '8', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we are excited to inform you that DHT has decided to offer you a position.  DHT’s Administrative Director, Bill Demaray, will be contacting you shortly by email to discuss the required pre-employment (onboarding) enrollment steps. We look forward to meeting and working with you soon.' },
      { id: '9', subject: 'DHT Application Processed', email: 'Dear ' + this.data.applicant.first_name + ', </br>We thank you for the time you’ve spent interviewing with DHT.  After careful consideration, we feel that your qualifications do not currently match any available positions at DHT.  We will keep your application on file should any new opportunities arise.' },
    ];
    this.formUpdates();
    this.patchForm();
    this.recruiterSearchSubscription();
  }

  ngAfterViewInit() { }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region Patch form 
  patchForm() {
    const { applicant } = this.data;
    this.current_status_step = applicant.status_step;
    this.data.decisionMadeForm? this.current_status_message = "Results" : this.current_status_message = applicant.status_message;
    this.data.form.patchValue({
      to: applicant.email,
      id: applicant.id,
    });
  }
  //#endregion

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
    this.data.form?.controls['recruiter_id']?.disable({ emitEvent: false });
    this.data.form.reset();
  }

  send(): void {
    this.data.form.value['recruiter_id'] = this.data.form.value['recruiter_id']?.id != undefined ? this.data.form.value['recruiter_id']?.id : "";
    this.data.form.value['body'] = this.email_text;
    this._applicantService.patchApplicant(
        Object.assign(this.data.form.value, { to: this.data.applicant.email }),
        false,
        false
    );
    this.matDialogRef.close();
    this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
    this.data.form.reset();
  }

  skip(): void {
    this.data.form.value['recruiter_id'] = this.data.form.value['recruiter_id']?.id != undefined ? this.data.form.value['recruiter_id']?.id : "";
    this._applicantService.patchApplicant(
        Object.assign(this.data.form.value, { to: this.data.applicant.email }),
        false,
        true
    );
    this.matDialogRef.close();
    this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
    this.data.form.reset();
  }

  //#endregion

  //#region Select Recruiter Calendly link
  recruiterSelect(recruiter: any) {
    console.log(recruiter);
    if (this.data.preliminaryReview) {
      if (this.data?.form?.controls['status_message'].value == 'First Interview Scheduled') {
        if (this.emails[1].email.includes('&#8205')) {
          this.changeCalendlyLinkUpdate(recruiter, 1);
        }
        else {
          this.changeCalendlyLinkAdd(recruiter, 1);
        }
      }
      if (this.data?.form?.controls['status_message'].value == 'Waitlisted') {
        if (this.emails[2].email.includes('&#8205')) {
          this.changeCalendlyLinkUpdate(recruiter, 2);
        }
        else {
          this.changeCalendlyLinkAdd(recruiter, 2);
        }
      }
      if (this.data?.form?.controls['status_message'].value == 'Qualifications dont match current openings') {
        if (this.emails[3].email.includes('&#8205')) {
          this.changeCalendlyLinkUpdate(recruiter, 3);
        }
        else {
          this.changeCalendlyLinkAdd(recruiter, 3);
        }
      }
    }
    if (this.data.interviewCompletedForm) {
      if (this.data?.form.controls['status_message'].value == 'Second Interview Scheduled' || this.data?.form.controls['status_message'].value == 'Third Interview Scheduled') {
        if (this.emails[1].email.includes('&#8205')) {
          this.changeCalendlyLinkUpdate(recruiter, 1);
        }
        else {
          this.changeCalendlyLinkAdd(recruiter, 1);
        }
      }
      if (this.data?.form.controls['status_message'].value == 'Scheduled Reference Call') {
        if (this.emails[4].email.includes('&#8205')) {
          this.changeCalendlyLinkUpdate(recruiter, 4);
        }
        else {
          this.changeCalendlyLinkAdd(recruiter, 4);
        }
      }
    }
  }

  changeCalendlyLinkUpdate(recruiter: any, index) {
    const split = this.emails[index].email.split('</br>')
    split.pop();
    split.pop();
    split.pop();
    split.push(recruiter.calendly);
    this.emails[index].email = split.join('</br>');
    this.email_text = this.emails[index].email;
  }

  changeCalendlyLinkAdd(recruiter: any, index) {
    this.emails[index].email = this.emails[index].email + '&#8205';
    this.emails[index].email = this.emails[index].email + `</br>${recruiter.calendly}`;
    this.email_text = this.emails[index].email;
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

  //#region Form Value Updates
  formUpdates() {
    this.data.form?.valueChanges.subscribe((_formValues => {
      //#region Advance Preliminary Review Handlers //
      if (this.data.preliminaryReview) {
        // Advance to 1st Interview //
        if (this.current_status_step == 2 && _formValues["status_message"] === "First Interview Scheduled") {          
          this.reason_for_rejection = false;
          this.next_status_step = 3;
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
          this.email_text = this.emails[1].email;
          this.data.form.patchValue(
            {
              subject: this.emails[1].subject,
              body: this.emails[1].email,
              prev_status_step: this.current_status_step,
              prev_status_message: this.current_status_message,
              status_step: '3',
              status_message: 'First Interview Scheduled'
            },
            {
              emitEvent: false,
              onlySelf: true
            }
          );
          console.log('Form Data', this.data.form.value);
        }
        // Wait Listed //
        else if (this.current_status_step == 2 && _formValues["status_message"] === "Waitlisted") {
          this.reason_for_rejection = true;
          this.next_status_step = 12.2;
          this.email_text = this.emails[2].email;
          this.data.form.patchValue({
            subject: this.emails[2].subject,
            body: this.emails[2].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '12.2',
            status_message: "Waitlisted"

          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
        // Qualifications dont match current openings //
        else if (this.current_status_step == 2 && _formValues["status_message"] === "Qualifications dont match current openings") {
          this.reason_for_rejection = true;
          this.next_status_step = '12.3';
          this.email_text = this.emails[3].email;
          this.data.form.patchValue({
            subject: this.emails[3].subject,
            body: this.emails[3].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '12.3',
            status_message: "Qualifications dont match current openings"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
          // Wait Listed //
          else if (this.current_status_step == 2 && _formValues["status_message"] === "Rejected") {
            this.reason_for_rejection = true;
            this.next_status_step = 12.5;
            this.email_text = this.emails[3].email;
            this.data.form.patchValue({
              subject: this.emails[3].subject,
              body: this.emails[3].email,
              prev_status_step: this.current_status_step,
              prev_status_message: this.current_status_message,
              status_step: '12.5',
              status_message: "Rejected"
  
            },
              {
                emitEvent: false,
                onlySelf: true
              })
            this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
          }
      }
      //#endregion

      //#region Interview Handlers //
      if (this.data.interviewCompletedForm) {
        if (_formValues['status_message'] === "Second Interview Scheduled") {
          
          this.reason_for_rejection = false;
          this.next_status_step = 5;
          this.email_text = this.emails[1].email;
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
          this.data.form.patchValue({
            subject: this.emails[1].subject,
            body: this.emails[1].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '5',
            status_message: "Second Interview Scheduled",
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
        }
        else if (_formValues['status_message'] === "Third Interview Scheduled") {
          
          this.reason_for_rejection = false;
          this.next_status_step = 9;
          this.email_text = this.emails[1].email;
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
          this.data.form.patchValue({
            subject: this.emails[1].subject,
            body: this.emails[1].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '9',
            status_message: "Third Interview Scheduled"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
        }
        else if (_formValues['status_message'] === 'Scheduled Reference Call') {
          
          this.reason_for_rejection = false;
          this.next_status_step = 7;
          this.email_text = this.emails[4].email;
          this.data.form.patchValue({
            subject: this.emails[4].subject,
            body: this.emails[4].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '7',
            status_message: "Scheduled Reference Call"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].enable({ emitEvent: false });
          this.isReferenceCall = true;
        }
        else if (_formValues['status_message'] === 'Waitlisted') {
          this.reason_for_rejection = true;
          this.email_text = this.emails[5].email;
          this.data.form.patchValue({
            subject: this.emails[5].subject,
            body: this.emails[5].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '12.2',
            status_message: "Waitlisted"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
        else if (this.data.form.controls['status_message'].value === 'Qualifications dont match current openings') {
          this.reason_for_rejection = true;
          this.email_text = this.emails[6].email;
          this.data.form.patchValue({
            subject: this.emails[6].subject,
            body: this.emails[6].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '12.3',
            status_message: "Qualifications dont match current openings"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
        else if (_formValues['status_message'] === 'Rejected') {
          this.reason_for_rejection = true;
          this.email_text = this.emails[3].email;
          this.data.form.patchValue({
            subject: this.emails[3].subject,
            body: this.emails[3].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            status_step: '12.5',
            status_message: "Rejected"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
      }
      //#endregion

      // Decision Made Handlers //
      if (this.data.decisionMadeForm) {
        if (_formValues['status_message'] === 'Offer Made') {
          
          this.reason_for_rejection = false;
          this.next_status_step = '11';
          this.email_text = this.emails[7].email;
          this.data.form.patchValue({
            subject: this.emails[7].subject,
            body: this.emails[7].email,
            prev_status_step: '10',
            prev_status_message: "Recruiter Decision Made",
            previous_status_message: this.data.applicant.status_message,
            status_step: '11',
            status_message: "Offer Made"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
        }
        else if (_formValues['status_message'] === 'Waitlisted') {
          this.reason_for_rejection = true;
          this.email_text = this.emails[5].email;
          this.data.form.patchValue({
            subject: this.emails[5].subject,
            body: this.emails[5].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            previous_status_message: this.data.applicant.status_message,
            status_step: '12.2',
            status_message: "Waitlisted"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
        else if (_formValues['status_message'] === 'Qualifications dont match current openings') {
          this.reason_for_rejection = true;
          this.next_status_step = '12.3';
          this.email_text = this.emails[8].email;
          this.data.form.patchValue({
            subject: this.emails[8].subject,
            body: this.emails[8].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            previous_status_message: this.data.applicant.status_message,
            status_step: '12.3',
            status_message: "Qualifications dont match current openings"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
        }
        else if (_formValues['status_message'] === 'Rejected') {
          this.reason_for_rejection = true;
          this.email_text = this.emails[3].email;
          this.data.form.patchValue({
            subject: this.emails[3].subject,
            body: this.emails[3].email,
            prev_status_step: this.current_status_step,
            prev_status_message: this.current_status_message,
            previous_status_message: this.data.applicant.status_message,
            status_step: '12.5',
            status_message: "Rejected"
          },
            {
              emitEvent: false,
              onlySelf: true
            })
          this.data.form.controls['recruiter_id'].disable({ emitEvent: false });
        }
      }
    }));
  }
  //#endregion

}

