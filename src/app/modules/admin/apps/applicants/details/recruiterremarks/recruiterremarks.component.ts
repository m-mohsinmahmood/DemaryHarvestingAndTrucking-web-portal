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
            id: [''],
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cell_phone_number: ['', [Validators.required]],
            home_phone_number: [''],
            date_of_birth: ['', [Validators.required]],
            age: ['', [Validators.required]],
            marital_status: ['', [Validators.required]],
            languages: ['', [Validators.required]],
            rank_speaking_english: ['', [Validators.required]],
        });

        this.secondFormGroup = this._formBuilder.group({
            address_1: ['', [Validators.required]],
            address_2: [''],
            town_city: ['', [Validators.required]],
            county_providence: ['', [Validators.required]],
            state: ['', [Validators.required]],
            postal_code: ['', [Validators.required]],
            country: ['', [Validators.required]],
            avatar: [''],
        });

        this.thirdFormGroup = this._formBuilder.group({
            question_1: ['', [Validators.required]],
            question_2: ['', [Validators.required]],
            question_3: ['', [Validators.required]],
            question_4: ['', [Validators.required]],
            question_5: ['', [Validators.required]],
            authorized_to_work: ['', [Validators.required]],
            us_citizen: ['', [Validators.required]],
            cdl_license: ['', [Validators.required]],
            lorry_license: ['', [Validators.required]],
            tractor_license: ['', [Validators.required]],
            passport: ['', [Validators.required]],
            work_experience_description: ['', [Validators.required]],
            employment_period: ['', [Validators.required]],


        });

        this.fourthFormGroup = this._formBuilder.group({
            supervisor_name: ['', [Validators.required]],
            supervisor_contact: ['', [Validators.required]],
            degree_name: ['', [Validators.required]],
            reason_for_applying: ['', [Validators.required]],
            hear_about_dht: ['', [Validators.required]],

        });

        this.fifthFormGroup = this._formBuilder.group({
            us_phone_number: [''],
            blood_type: [''],
            emergency_contact_name: [''],
            emergency_contact_phone: [''],


        });
        this.sixthFormGroup = this._formBuilder.group({
            first_phone_call: [''],
            first_call_remarks: [''],
            first_call_ranking: [''],
            first_interviewer_id: [''],
            reference_phone_call: [''],
            reference_call_remarks: [''],
            reference_call_ranking: [''],
            reference_interviewer_id: [''],
            second_phone_call: [''],
            second_call_remarks: [''],
            second_call_ranking: [''],
            second_interviewer_id: [''],
            third_phone_call: [''],
            third_call_remarks: [''],
            third_call_ranking: [''],
            third_interviewer_id: [''],
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
                        date_of_birth: applicantObjData.date_of_birth,
                        age: applicantObjData.age,
                        marital_status: applicantObjData.marital_status,
                        rank_speaking_english: applicantObjData.rank_speaking_english,
                        languages: applicantObjData.languages.replace(/\s/g, '').split(','),
                        // status: applicantObjData.status,
                    });
                    this.secondFormGroup.patchValue({
                        address_1: applicantObjData.address_1,
                        address_2: applicantObjData.address_2,
                        town_city: applicantObjData.town_city,
                        county_providence: applicantObjData.county_providence,
                        state: applicantObjData.state,
                        postal_code: applicantObjData.postal_code,
                        country: applicantObjData.country,
                        avatar: applicantObjData.avatar,
                    });
                    this.thirdFormGroup.patchValue({
                        question_1: applicantObjData.question_1,
                        question_2: applicantObjData.question_2,
                        question_3: applicantObjData.question_3,
                        question_4: applicantObjData.question_4,
                        question_5: applicantObjData.question_5,
                        authorized_to_work: applicantObjData.authorized_to_work.toString(),
                        us_citizen: applicantObjData.us_citizen.toString(),
                        cdl_license: applicantObjData.cdl_license.toString(),
                        lorry_license: applicantObjData.lorry_license.toString(),
                        tractor_license: applicantObjData.tractor_license.toString(),
                        passport: applicantObjData.passport.toString(),
                        work_experience_description: applicantObjData.work_experience_description,
                        employment_period: applicantObjData.employment_period,



                    });
                    this.fourthFormGroup.patchValue({
                        supervisor_name: applicantObjData.supervisor_name,
                        supervisor_contact: applicantObjData.supervisor_contact,
                        degree_name: applicantObjData.degree_name,
                        reason_for_applying: applicantObjData.reason_for_applying,
                        hear_about_dht: applicantObjData.hear_about_dht,
                    });
                    this.fifthFormGroup.patchValue({
                        us_phone_number: applicantObjData.us_phone_number,
                        blood_type: applicantObjData.blood_type,
                        emergency_contact_name: applicantObjData.emergency_contact_name,
                        emergency_contact_phone: applicantObjData.emergency_contact_phone,

                    });
                    this.sixthFormGroup.patchValue({
                        first_call_remarks: applicantObjData.first_call_remarks,
                        first_call_ranking: applicantObjData.first_call_ranking,
                        first_interviewer_id: applicantObjData.first_interviewer_id,

                        reference_call_remarks: applicantObjData.reference_call_remarks,
                        reference_call_ranking: applicantObjData.reference_call_ranking,
                        reference_interviewer_id: applicantObjData.reference_interviewer_id,

                        second_call_remarks: applicantObjData.second_call_remarks,
                        second_call_ranking: applicantObjData.second_call_ranking,
                        second_interviewer_id: applicantObjData.second_interviewer_id,

                        third_call_remarks: applicantObjData.third_call_remarks,
                        third_call_ranking: applicantObjData.third_call_ranking,
                        third_interviewer_id: applicantObjData.third_interviewer_id,
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
