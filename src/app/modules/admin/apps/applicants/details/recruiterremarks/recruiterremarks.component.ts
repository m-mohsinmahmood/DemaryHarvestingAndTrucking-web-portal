import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Applicant } from '../../applicants.types';
import { Observable, Subject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import moment from 'moment';
import { ApplicantService } from '../../applicants.services';



@Component({
  selector: 'app-recruiterremarks',
  templateUrl: './recruiterremarks.component.html',
  styleUrls: ['./recruiterremarks.component.scss']
})
export class RecruiterremarksComponent implements OnInit {
  applicant$: Observable<Applicant>;
    isLoadingApplicant$: Observable<boolean>;
    applicants$: Observable<Applicant[]>;
    isLoadingApplicants$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input()applicantData : any;


  form: FormGroup;
    formArr = [];
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    sixthFormGroup: FormGroup;
    seventhFormGroup: FormGroup;

  constructor(
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.initApplicantForm();
  }

    // #region initializing forms
    initApplicantForm() {
      this.firstFormGroup = this._formBuilder.group({
        id:[''],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: [
            '',
            [
                Validators.required,
                Validators.pattern(
                    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                ),
            ],
        ],
        cell_phone_number: ['', [Validators.required]],
        home_phone_number: ['', ''],
        languages: ['', [Validators.required]],
        status: ['', [Validators.required]],
    });

    this.secondFormGroup = this._formBuilder.group({
        date_of_birth: ['', [Validators.required]],
        calendar_year: [moment()],
        marital_status: ['', [Validators.required]],
        address_1: ['', [Validators.required]],
        address_2: ['', ''],
        city: ['', [Validators.required]],
        county: ['', [Validators.required]],
        self_rating:['',[Validators.required]],
        postal_code: ['', [Validators.required]],
        country: ['', [Validators.required]],
        us_citizen: ['', [Validators.required]],
        tractor_license: ['', [Validators.required]],
        passport: ['', [Validators.required]],
        //imageURL: ['', [Validators.required]],
        avatar: [''],
        resume:['']

    });
    this.thirdFormGroup = this._formBuilder.group({
        question_1: ['', [Validators.required]],
        question_2: ['', [Validators.required]],
        question_3: ['', [Validators.required]],
        question_4: ['', [Validators.required]],
        question_5: ['', [Validators.required]],
        work_experience_description: ['', [Validators.required]],
        recent_job: ['', [Validators.required]],
        supervisor: ['', [Validators.required]],
        supervisor_contact: ['', [Validators.required]],
    });

    this.fourthFormGroup = this._formBuilder.group({
        degree_name: ['', [Validators.required]],
        institute_name: ['', [Validators.required]],
        education: ['', [Validators.required]],
    });

    this.fifthFormGroup = this._formBuilder.group({
        blood_group: [''],
        reason_for_applying: ['', [Validators.required]],
        e_thirdQuestion: ['', ''],
    });
     
      this.sixthFormGroup = this._formBuilder.group({
          first_phone_call: [''],
          first_call_remarks: [''],
          first_call_ranking: [''],
          first_interviewer_id:[''],
          reference_phone_call: [''],
          reference_call_remarks: [''],
          reference_call_ranking: [''],
          reference_interviewer_id:[''],
          second_phone_call: [''],
          second_call_remarks: [''],
          second_call_ranking: [''],
          second_interviewer_id:[''],
          third_phone_call: [''],
          third_call_remarks: [''],
          third_call_ranking: [''],
          third_interviewer_id:[''],
      });

      this.formArr = [
          this.firstFormGroup,
          this.secondFormGroup,
          this.thirdFormGroup,
          this.fourthFormGroup,
          this.fifthFormGroup,
          this.sixthFormGroup,
      ];

      if (this.applicantData !== null) {
        console.log("in rec", this.applicantData);
          this._applicantService
              .getApplicantById(this.applicantData?.id)
              .subscribe((applicantObjData: any) => {
                this.firstFormGroup.patchValue({
                  id: applicantObjData.id,
                  first_name: applicantObjData.first_name,
                  last_name: applicantObjData.last_name,
                  email: applicantObjData.email,
                  cell_phone_number: applicantObjData.cell_phone_number,
                  home_phone_number: applicantObjData.home_phone_number,
                  languages: applicantObjData.languages.replace(/\s/g, '').split(','),
                  status: applicantObjData.status.toString(),
              });
              this.secondFormGroup.patchValue({
                  date_of_birth: moment(applicantObjData.date_of_birth)
                          .subtract(1, 'week')
                          .hour(18)
                          .minute(56)
                          .toISOString(),
                  calendar_year: applicantObjData.calendar_year,
                  marital_status: applicantObjData.marital_status,
                  address_1: applicantObjData.address_1,
                  address_2: applicantObjData.address_2,
                  city: applicantObjData.city,
                  province: applicantObjData.state,
                  postal_code: applicantObjData.postal_code,
                  country: applicantObjData.country,
                  self_rating:applicantObjData.self_rating,
                  us_citizen: applicantObjData.us_citizen.toString(),
                  tractor_license: applicantObjData.tractor_license.toString(),
                  passport: applicantObjData.passport.toString(),
                  county: applicantObjData.county,
                  //   imageURL: applicantObjData.imageURL,
                  avatar: applicantObjData.avatar,
              });
              this.thirdFormGroup.patchValue({
                  question_1: applicantObjData.question_1,
                  question_2: applicantObjData.question_2,
                  question_3: applicantObjData.question_3,
                  question_4: applicantObjData.question_4,
                  question_5: applicantObjData.question_5,
                  work_experience_description:
                      applicantObjData.work_experience_description,
                  recent_job: applicantObjData.recent_job,
                  supervisor: applicantObjData.supervisor,
                  supervisor_contact: applicantObjData.supervisor_contact,
              });
              this.fourthFormGroup.patchValue({
                  degree_name: applicantObjData.degree_name,
                  institute_name: applicantObjData.institute_name,
                  education: applicantObjData.education,
              });
              this.fifthFormGroup.patchValue({
                  blood_group: applicantObjData.blood_group,
                  reason_for_applying:
                      applicantObjData.reason_for_applying,
              });
              
                this.sixthFormGroup.patchValue({
                  first_phone_call: applicantObjData.first_phone_call,
                  first_call_remarks: applicantObjData.first_call_remarks,
                  first_call_ranking: applicantObjData.first_call_ranking,
                  first_interviewer_id:applicantObjData.first_interviewer_id,

                  reference_phone_call: applicantObjData.reference_phone_call,
                  reference_call_remarks: applicantObjData.reference_call_remarks,
                  reference_call_ranking: applicantObjData.reference_call_ranking,
                  reference_interviewer_id:applicantObjData.reference_interviewer_id, 

                  second_phone_call: applicantObjData.second_phone_call,
                  second_call_remarks:applicantObjData.second_call_remarks,
                  second_call_ranking: applicantObjData.second_call_ranking,
                  second_interviewer_id:applicantObjData.second_interviewer_id,

                  third_phone_call: applicantObjData.third_phone_call,
                  third_call_remarks: applicantObjData.third_call_remarks,
                  third_call_ranking: applicantObjData.third_call_ranking,
                  third_interviewer_id:applicantObjData.third_interviewer_id,
              });
              });
          this._changeDetectorRef.markForCheck();
      }
  }
  // #endregion

  submit(): void {
    this.form = this._formBuilder.group({});
    this.formArr.forEach((f) => {
        Object.entries(f.value).forEach((element) => {
            const control = this._formBuilder.control(element[1]);
            this.form.addControl(element[0], control);
        });
    });
    this._applicantService.isLoadingApplicant.next(true);
    if (this.applicantData) {
        console.log(this.applicantData, this.applicantData.isEdit);
        this.updateApplicant(this.form.value);
    } 
}
updateApplicant(applicantData: any): void {
    this._applicantService.updateApplicant(applicantData);
}

}
