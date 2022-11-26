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
    @Input() applicantData: any;


    form: FormGroup;
    formArr = [];
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    //sixthFormGroup: FormGroup;
    seventhFormGroup: FormGroup;
    firstInterviewForm: FormGroup;
    secondInterviewForm: FormGroup;
    thirdInterviewForm: FormGroup;
    referenceForm: FormGroup







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
        // this.sixthFormGroup = this._formBuilder.group({
        //     first_phone_call: [''],
        //     first_call_remarks: [''],
        //     first_call_ranking: [''],
        //     first_interviewer_id: [''],
        //     reference_phone_call: [''],
        //     reference_call_remarks: [''],
        //     reference_call_ranking: [''],
        //     reference_interviewer_id: [''],
        //     second_phone_call: [''],
        //     second_call_remarks: [''],
        //     second_call_ranking: [''],
        //     second_interviewer_id: [''],
        //     third_phone_call: [''],
        //     third_call_remarks: [''],
        //     third_call_ranking: [''],
        //     third_interviewer_id: [''],
        //     status_message: [''],
        //     status_step:[''],
        //     id: [''],
        // });
        this.firstInterviewForm = this._formBuilder.group({
            first_call_remarks: this.applicantData?.first_call_remarks,
            first_call_ranking: this.applicantData?.first_call_ranking,
            first_interviewer_id: this.applicantData?.first_interviewer_id,
            status_message: [''],
            status_step:[''],
            id: [''],
        });
        this.secondInterviewForm = this._formBuilder.group({        
            second_call_remarks: this.applicantData?.second_call_remarks,
            second_call_ranking: this.applicantData?.second_call_ranking,
            second_interviewer_id: this.applicantData?.second_interviewer_id,
            status_message: [''],
            status_step:[''],
            id: [''],
        });
        this.thirdInterviewForm = this._formBuilder.group({           
            third_call_remarks: this.applicantData?.third_call_remarks,
            third_call_ranking: this.applicantData?.third_call_ranking,
            third_interviewer_id: this.applicantData?.third_interviewer_id,
            status_message: [''],
            status_step:[''],
            id: [''],
        });
        this.referenceForm = this._formBuilder.group({         
            reference_call_remarks: this.applicantData?.reference_call_remarks,
            reference_call_ranking: this.applicantData?.reference_call_ranking,
            reference_interviewer_id: this.applicantData?.reference_interviewer_id,
            status_message: [''],
            status_step:[''],
            id: [''],
        });

        this.formArr = [
            this.firstFormGroup,
            this.secondFormGroup,
            this.thirdFormGroup,
            this.fourthFormGroup,
            this.fifthFormGroup,
            this.firstInterviewForm,
            this.secondInterviewForm,
            this.thirdInterviewForm,
            this.referenceForm
           // this.sixthFormGroup,
        ];
        if (this.applicantData !== null) {
            this.firstFormGroup.patchValue({
                id: this.applicantData?.id,
                first_name: this.applicantData?.first_name,
                last_name: this.applicantData?.last_name,
                email: this.applicantData?.email,
                cell_phone_number: this.applicantData?.cell_phone_number,
                home_phone_number: this.applicantData?.home_phone_number,
                date_of_birth: this.applicantData?.date_of_birth,
                age: this.applicantData?.age,
                marital_status: this.applicantData?.marital_status,
                rank_speaking_english: this.applicantData?.rank_speaking_english,
                languages: this.applicantData?.languages.replace(/\s/g, '').split(','),
                // status: this.applicantData?.status,
            });
            this.secondFormGroup.patchValue({
                address_1: this.applicantData?.address_1,
                address_2: this.applicantData?.address_2,
                town_city: this.applicantData?.town_city,
                county_providence: this.applicantData?.county_providence,
                state: this.applicantData?.state,
                postal_code: this.applicantData?.postal_code,
                country: this.applicantData?.country,
                avatar: this.applicantData?.avatar,
            });
            this.thirdFormGroup.patchValue({
                question_1: this.applicantData?.question_1,
                question_2: this.applicantData?.question_2,
                question_3: this.applicantData?.question_3,
                question_4: this.applicantData?.question_4,
                question_5: this.applicantData?.question_5,
                authorized_to_work: this.applicantData?.authorized_to_work.toString(),
                us_citizen: this.applicantData?.us_citizen.toString(),
                cdl_license: this.applicantData?.cdl_license.toString(),
                lorry_license: this.applicantData?.lorry_license.toString(),
                tractor_license: this.applicantData?.tractor_license.toString(),
                passport: this.applicantData?.passport.toString(),
                work_experience_description: this.applicantData?.work_experience_description,
                employment_period: this.applicantData?.employment_period,

            });
            this.fourthFormGroup.patchValue({
                supervisor_name: this.applicantData?.supervisor_name,
                supervisor_contact: this.applicantData?.supervisor_contact,
                degree_name: this.applicantData?.degree_name,
                reason_for_applying: this.applicantData?.reason_for_applying,
                hear_about_dht: this.applicantData?.hear_about_dht,
            });
            this.fifthFormGroup.patchValue({
                us_phone_number: this.applicantData?.us_phone_number,
                blood_type: this.applicantData?.blood_type,
                emergency_contact_name: this.applicantData?.emergency_contact_name,
                emergency_contact_phone: this.applicantData?.emergency_contact_phone,

            });
            // this.sixthFormGroup.patchValue({
            //     id: this.applicantData?.id,
            //     first_call_remarks: this.applicantData?.first_call_remarks,
            //     first_call_ranking: this.applicantData?.first_call_ranking,
            //     first_interviewer_id: this.applicantData?.first_interviewer_id,

            //     second_call_remarks: this.applicantData?.second_call_remarks,
            //     second_call_ranking: this.applicantData?.second_call_ranking,
            //     second_interviewer_id: this.applicantData?.second_interviewer_id,

            //     third_call_remarks: this.applicantData?.third_call_remarks,
            //     third_call_ranking: this.applicantData?.third_call_ranking,
            //     third_interviewer_id: this.applicantData?.third_interviewer_id,

            //     reference_call_remarks: this.applicantData?.reference_call_remarks,
            //     reference_call_ranking: this.applicantData?.reference_call_ranking,
            //     reference_interviewer_id: this.applicantData?.reference_interviewer_id,

            // });
            this.firstInterviewForm.patchValue({
                id: this.applicantData?.id,
                first_call_remarks: this.applicantData?.first_call_remarks,
                first_call_ranking: this.applicantData?.first_call_ranking,
                first_interviewer_id: this.applicantData?.first_interviewer_id,
            })
            this.secondInterviewForm.patchValue({
                id: this.applicantData?.id,            
                second_call_remarks: this.applicantData?.second_call_remarks,
                second_call_ranking: this.applicantData?.second_call_ranking,
                second_interviewer_id: this.applicantData?.second_interviewer_id,
            })
            this.secondInterviewForm.patchValue({
                id: this.applicantData?.id,            
                third_call_remarks: this.applicantData?.third_call_remarks,
                third_call_ranking: this.applicantData?.third_call_ranking,
                third_interviewer_id: this.applicantData?.third_interviewer_id,
            })
            this.referenceForm.patchValue({
                id: this.applicantData?.id,            
                reference_call_remarks: this.applicantData?.reference_call_remarks,
                reference_call_ranking: this.applicantData?.reference_call_ranking,
                reference_interviewer_id: this.applicantData?.reference_interviewer_id,
            })
            this._changeDetectorRef.markForCheck();
        }
    }
    // #endregion

    submit(interViewer: string): void {
        if(interViewer === 'First'){
            this.firstInterviewForm.value.status_step = '4'
            this._applicantService.patchApplicant(this.firstInterviewForm.value , true);
        }else if(interViewer === 'Second'){
            this.secondInterviewForm.value.status_step = '5'
            this._applicantService.patchApplicant(this.secondInterviewForm.value , true);
        }else if(interViewer === 'Third'){
            this.thirdFormGroup.value.status_step = '6'
            this._applicantService.patchApplicant(this.thirdInterviewForm.value , true);
        }else if(interViewer === 'Reference'){
            this.referenceForm.value.status_step = '7'
            this._applicantService.patchApplicant(this.referenceForm.value , true);
        }

        // this.sixthFormGroup.value;

        // this.form = this._formBuilder.group({});
        // this.formArr.forEach((f) => {
        //     Object.entries(f.value).forEach((element) => {
        //         const control = this._formBuilder.control(element[1]);
        //         this.form.addControl(element[0], control);
        //     });
        // });
        // this._applicantService.isLoadingApplicant.next(true);
        // if (this.applicantData) {
        //     console.log(this.applicantData, this.applicantData.isEdit);
        //     this.updateApplicant(this.form.value);
        // }
    }


    updateApplicant(applicantData: any): void {
        this._applicantService.updateApplicant(applicantData);
    }

}
