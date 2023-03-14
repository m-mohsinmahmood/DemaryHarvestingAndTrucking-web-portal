import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Applicant } from '../../applicants.types';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicantService } from '../../applicants.services';
@Component({
    selector: 'app-recruiterremarks',
    templateUrl: './recruiterremarks.component.html',
    styleUrls: ['./recruiterremarks.component.scss']
})
export class RecruiterremarksComponent implements OnInit {

    //#region Observables
    applicant$: Observable<Applicant>;
    isLoadingApplicant$: Observable<boolean>;
    applicants$: Observable<Applicant[]>;
    isLoadingApplicants$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // @Input() applicantData: any;
    //#endregion

    //#region local variables
    form: FormGroup;
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    seventhFormGroup: FormGroup;
    firstInterviewForm: FormGroup;
    secondInterviewForm: FormGroup;
    thirdInterviewForm: FormGroup;
    referenceForm: FormGroup
    status_step;
    applicantData;
    score: string;
    isSave: string = '0';
    //#endregion

    constructor(
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
    ) { }

    ngOnInit(): void {
        this.applicant$ = this._applicantService.applicant$;
        this.applicant$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res: any) => {
            this.applicantData = res.applicant_info;
        });
        this.status_step = this.applicantData?.status_step;
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

        this.firstInterviewForm = this._formBuilder.group({
            first_call_remarks: [{
                value: this.applicantData?.first_call_remarks == null ?
                    "· What is the most important aspect of the job, money, environment, travel, learning something new, the nature of the work? \n· Does applicant have a girlfriend/married/children? \n· Have you ever completed foreign work tour? \n· Do you have a trade certiﬁcate, or special training? Any college? \n· What is your biggest accomplishment to date? (later – 3rd interview) \n· What were your duties in prior job? \n· What can you offer to the company? (later – 3rd interview) \n· Is this person eager to get the job, have a team spirit and willing to help others?"
                    : this.applicantData?.first_call_remarks, disabled: this.applicantData.first_interviewer_id && this.applicantData.first_call_remarks && this.applicantData.first_call_ranking
            }],
            first_call_ranking: [{ value: this.applicantData?.first_call_ranking, disabled: this.applicantData.first_call_ranking }],
            first_interviewer_id: [{ value: this.applicantData?.first_interviewer_name, disabled: this.applicantData.first_interviewer_id }],
            prev_status_message: ['Preliminary Review'],
            status_message: ['First Interview Completed'],
            status_step: ['4'],
            ranking: this.applicantData?.ranking,
            id: [this.applicantData?.id]
        });

        this.secondInterviewForm = this._formBuilder.group({
            second_call_remarks: [{
                value: this.applicantData?.second_call_remarks == null ?
                    "· Have you ever had roommates and what problems does that present? \n· What mistakes do supervisors most commonly make? \n· Does he seem arrogant and insubordinate? \n· What are your expectations from this job experience? \n· Does he understand the priority is getting the job done? \n· What implements, trailers, wagons have you pulled and for how long? \n· What model combine have you operated/platforms/crops and for how long? \n· What trucks/lorries have you driven for how long? Describe loads? \n· How concerned are you about the quality of your performance and others? \n· Do you have any licenses? \n· What mechanical experience? \n· What repairs have you done on gear you’ve operated? \n· Any work history or training as a mechanic?"
                    : this.applicantData?.second_call_remarks, disabled: this.applicantData.second_interviewer_id && this.applicantData.second_call_remarks && this.applicantData.second_call_ranking
            }],
            second_call_ranking: [{ value: this.applicantData?.second_call_ranking, disabled: this.applicantData.second_call_ranking }],
            second_interviewer_id: [{ value: this.applicantData?.second_interviewer_name, disabled: this.applicantData.second_interviewer_id }],
            prev_status_message: ['First Interview Completed'],
            status_message: ['Second Interview Completed'],
            status_step: ['6'],
            ranking: this.applicantData?.ranking,
            id: [this.applicantData?.id]
        });

        this.thirdInterviewForm = this._formBuilder.group({
            third_call_remarks: [{
                value: this.applicantData?.third_call_remarks == null ?
                    "· Three to four weeks of company orientation, training, or administrative tasks with minimal pay. \n· Weather impacts work schedule which requires ﬂexibility.\n· Explain compensation\n· Pre-employment and random drug and alcohol tests\n· Explain Reprimand process.\n· Living conditions.\n· Arizona heat, living and working with others 24/7 so must share company vehicles and housing.\n· Don’t come if you can’t complete the season, are strictly interested in how much money you make, or drinking and partying is a priority for you?\n· Importance of keeping living area and vehicle clean. (Cleaning charge.) \n· Explain onboarding process.\n· Explain the process for using a Smart Phone for data entry.\n· Explain TEAM online training prior to arrival. (Web Portal and Mobile App)\n· Explain Visa process, consulate interview and reimbursement.\n· CDL training prior to arrival.\n· Explain travel and reimbursement.\n· Explain the importance for maintaining contact with recruiter/company.\n· If we hire you, will you accept the job. If yes, make an offer.\n· Applicant must accept job within three days."
                    : this.applicantData?.third_call_remarks, disabled: this.applicantData.third_interviewer_id && this.applicantData.third_call_remarks && this.applicantData.third_call_ranking
            }],

            third_call_ranking: [{ value: this.applicantData?.third_call_ranking, disabled: this.applicantData.third_call_ranking }],
            third_interviewer_id: [{ value: this.applicantData?.third_interviewer_name, disabled: this.applicantData.third_interviewer_id }],
            prev_status_message: ['Reference Call Completed'],
            status_message: ['Third Interview Completed'],
            status_step: ['10'],
            ranking: this.applicantData?.ranking,
            id: [this.applicantData?.id]
        });

        this.referenceForm = this._formBuilder.group({
            reference_call_remarks: [{
                value: this.applicantData?.reference_call_remarks == null ?
                    "· What duties did he/she have and the quality of work? \n· Was the applicant dependable, any tardiness or absence?\n· How were his human relations? Did he get along with co-workers and customers?\n· How was his stewardship? Does he take care of the gear, tools, or supplies for which he is responsible?\n· Is the applicant cooperative, does he readily and enthusiastically perform the work he is assigned?\n· Would you rehire this person? Yes - No"
                    : this.applicantData?.reference_call_remarks, disabled: this.applicantData.reference_interviewer_id && this.applicantData.reference_call_remarks && this.applicantData.reference_call_ranking
            }],

            reference_call_ranking: [{ value: this.applicantData?.reference_call_ranking, disabled: this.applicantData.reference_call_ranking }],
            reference_interviewer_id: [{ value: this.applicantData?.reference_interviewer_name, disabled: this.applicantData.reference_interviewer_id }],
            prev_status_message: ['Second Interview Completed'],
            status_message: ['Reference Call Completed'],
            status_step: ['8'],
            ranking: this.applicantData?.ranking,
            id: [this.applicantData?.id]
        });

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
                languages: this.applicantData?.languages.replace(/\s/g, '').split(',')
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

            this.firstInterviewForm.patchValue({
                id: this.applicantData?.id,
                //first_call_remarks: this.applicantData?.first_call_remarks,
                first_call_ranking: this.applicantData?.first_call_ranking,
                first_interviewer_id: this.applicantData?.first_interviewer_name,
            });

            this.secondInterviewForm.patchValue({
                id: this.applicantData?.id,
                // second_call_remarks: this.applicantData?.second_call_remarks,
                second_call_ranking: this.applicantData?.second_call_ranking,
                second_interviewer_id: this.applicantData?.second_interviewer_name,
            });

            this.thirdInterviewForm.patchValue({
                id: this.applicantData?.id,
                //third_call_remarks: this.applicantData?.third_call_remarks,
                third_call_ranking: this.applicantData?.third_call_ranking,
                third_interviewer_id: this.applicantData?.third_interviewer_name,
            });

            this.referenceForm.patchValue({
                id: this.applicantData?.id,
                //reference_call_remarks: this.applicantData?.reference_call_remarks,
                reference_call_ranking: this.applicantData?.reference_call_ranking,
                reference_interviewer_id: this.applicantData?.reference_interviewer_name,
            })
            this._changeDetectorRef.markForCheck();
        }
    }
    // #endregion

    validation(form: string) {
        if (form === "firstInterview" &&
            (!this.firstInterviewForm.get('first_interviewer_id').value ||
                !this.firstInterviewForm.get('first_call_remarks').value ||
                !this.firstInterviewForm.get('first_call_ranking').value)
        ) return true;

        else if (form === "secondInterview" &&
            (!this.secondInterviewForm.get('second_interviewer_id').value ||
                !this.secondInterviewForm.get('second_call_remarks').value ||
                !this.secondInterviewForm.get('second_call_ranking').value)
        ) return true;

        else if (form === "thirdInterview" &&
            (!this.thirdInterviewForm.get('third_interviewer_id').value ||
                !this.thirdInterviewForm.get('third_call_remarks').value ||
                !this.thirdInterviewForm.get('third_call_ranking').value)
        ) return true;
        else if (form === "referenceInterview" &&
            (!this.referenceForm.get('reference_interviewer_id').value ||
                !this.referenceForm.get('reference_call_remarks').value ||
                !this.referenceForm.get('reference_call_ranking').value)
        ) return true;

    }

    //#region Submit
    submit(interViewer: string): void {
        this.isSave = '0';
        if (interViewer === 'First') {
            if (this.applicantData.status_step != 3) {
                this.calculateScore(this.firstInterviewForm);
                this.firstInterviewForm.controls['status_message'].setValue('First Interview Updated')
                this._applicantService.patchApplicant(this.firstInterviewForm.value, true, false);
            }
            else {
                this.firstInterviewForm.value.status_step = '3'
                this.calculateScore(this.firstInterviewForm);
                this._applicantService.patchApplicant(this.firstInterviewForm.value, true, false);
            }
        } else if (interViewer === 'Second') {
            if (this.applicantData.status_step != 5) {
                this.calculateScore(this.secondInterviewForm);
                this.secondInterviewForm.controls['status_message'].setValue('Second Interview Updated')
                this._applicantService.patchApplicant(this.secondInterviewForm.value, true, false);
            }
            else {
                this.secondInterviewForm.value.status_step = '5'
                this.calculateScore(this.secondInterviewForm);
                this._applicantService.patchApplicant(this.secondInterviewForm.value, true, false);
            }
        } else if (interViewer === 'Reference') {
            if (this.applicantData.status_step != 7) {
                this.calculateScore(this.referenceForm);
                this.referenceForm.controls['status_message'].setValue('Reference Interview Updated')
                this._applicantService.patchApplicant(this.referenceForm.value, true, false);
            }
            else {
                this.referenceForm.value.status_step = '7'
                this.calculateScore(this.referenceForm);
                this._applicantService.patchApplicant(this.referenceForm.value, true, false);
            }
        }
        else if (interViewer === 'Third') {
            if (this.applicantData.status_step != 9) {
                this.calculateScore(this.thirdInterviewForm);
                this.thirdInterviewForm.controls['status_message'].setValue('Third Interview Updated')
                this._applicantService.patchApplicant(this.thirdInterviewForm.value, true, false);
            }
            else {
                this.thirdFormGroup.value.status_step = '9'
                this.calculateScore(this.thirdInterviewForm);
                this._applicantService.patchApplicant(this.thirdInterviewForm.value, true, false);
            }
        }
    }
    //#endregion

    //#region Update Recruiter Remarks
    update(interviewer: string): void {
        if (interviewer === 'First') {
            this.isSave = '1';
            this.firstInterviewForm.controls['first_call_remarks'].enable();
            this.firstInterviewForm.controls['first_call_ranking'].enable();
        }
        else if (interviewer === 'Second') {
            this.isSave = '2';
            this.secondInterviewForm.controls['second_call_remarks'].enable();
            this.secondInterviewForm.controls['second_call_ranking'].enable();
        }
        else if (interviewer === 'Reference') {
            this.isSave = '3';
            this.referenceForm.controls['reference_call_remarks'].enable();
            this.referenceForm.controls['reference_call_ranking'].enable();
        }
        else if (interviewer === 'Third') {
            this.isSave = '4';
            this.thirdInterviewForm.controls['third_call_remarks'].enable();
            this.thirdInterviewForm.controls['third_call_ranking'].enable();
        }
        //#endregion


    }
    //#region Calculate Score
    calculateScore(form) {
        let firstRanking = this.firstInterviewForm.controls['first_call_ranking'].value;
        let secondRanking = this.secondInterviewForm.controls['second_call_ranking'].value;
        let thirdRanking = this.thirdInterviewForm.controls['third_call_ranking'].value;
        let refRanking = this.referenceForm.controls['reference_call_ranking'].value;
        this.score = "0";
        if (firstRanking && secondRanking && thirdRanking && refRanking) {

            this.score = (((+firstRanking + +secondRanking + +thirdRanking + +refRanking) / 40) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
        else if (firstRanking && secondRanking && refRanking) {

            this.score = (((+firstRanking + +secondRanking + +refRanking) / 30) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
        else if (firstRanking && refRanking) {

            this.score = (((+firstRanking + +refRanking) / 20) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
        else if (firstRanking && secondRanking && thirdRanking) {

            this.score = (((+firstRanking + +secondRanking + +thirdRanking) / 30) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
        else if (firstRanking && secondRanking) {

            this.score = (((+firstRanking + +secondRanking) / 20) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
        else if (firstRanking) {

            this.score = (((+firstRanking) / 10) * 100).toFixed(2)
            form.controls['ranking'].setValue(this.score);
        }
    }

    updateApplicant(applicantData: any): void {
        this._applicantService.updateApplicant(applicantData);
    }

}
