import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicantService } from 'app/modules/admin/apps/applicants/applicants.services';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import moment from 'moment';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
})
// @Inject(MAT_DIALOG_DATA)
export class UpdateComponent implements OnInit {
    roles: string[] = ['single', 'Married', 'Divorced'];
    stepperOrientation: Observable<StepperOrientation>;

    // #region local variables
    form: FormGroup;
    formArr= [];
    employees: any;
    flashMessage: 'success' | 'error' | null = null;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    sixthFormGroup: FormGroup;
    seventhFormGroup: FormGroup;
    isSubmit = false;
    isBack = false;
    imageURL: string = '';
    //   avatar: string = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
    routeID: string;
    avatar: string = '';
    isEdit: boolean;
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<UpdateComponent>,
        private _formBuilder: FormBuilder,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        public _router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        breakpointObserver: BreakpointObserver

    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 860px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        this.routeID = data ? data.id : '';
    }

    ngOnInit(): void {
        this.initApplicantForm();
        this.isEdit = this.data.isEdit;
    }
    // #region initializing forms
    initApplicantForm() {
        this.firstFormGroup = this._formBuilder.group({
            first_name: ['', ''],
            last_name: ['', ''],
            email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            cell_phone_number: ['', ''],
            home_phone_number: ['', ''],
            languages: [''],
        });

        this.secondFormGroup = this._formBuilder.group({
            date_of_birth: ['', ''],
            marital_status: ['', ''],
            address_1: ['', ''],
            address_2: ['', ''],
            city: ['', ''],
            county: ['', ''],
            postal_code: ['', ''],
            country: ['', ''],
            us_citizen: ['', ''],
            tractor_license: ['', ''],
            passport: ['', ''],
            //imageURL: ['', [Validators.required]],
            avatar: ['', ''],
        });
        this.thirdFormGroup = this._formBuilder.group({
            question_1: ['', ''],
            question_2: ['', ''],
            question_3: ['', ''],
            question_4: ['', ''],
            question_5: ['', ''],
            work_experience_description: ['', ''],
            recent_job: ['', ''],
            supervisor: ['', ''],
            supervisor_contact: ['', ''],
        });

        this.fourthFormGroup = this._formBuilder.group({
            degree_name: ['', ''],
            institute_name: ['', ''],
            education: ['', ''],
        });

        this.fifthFormGroup = this._formBuilder.group({    
            blood_group: ['', ''],
            reason_for_applying: ['', ''],
            e_thirdQuestion: ['', ''],
        });

        this.formArr = [this.firstFormGroup,this.secondFormGroup,this.thirdFormGroup,this.fourthFormGroup,this.fifthFormGroup]

        // if (this.data !== null) {
        //     this._applicantService
        //         .getApplicantById(this.data?.id)
        //         .subscribe((employee) => {

        //              this.firstFormGroup = this._formBuilder.group({
        //                fname: employee.firstEmail,
        //                lname: moment( employee.firstSentDate).subtract(1, 'week').hour(18).minute(56).toISOString(),
        //                email: employee.secondEmail,
        //                cellNumber: employee.cellPhone,
        //                homeNumber:employee.cellPhone,
        //                languages:employee.status,

        //              });
        //             this.secondFormGroup.patchValue({
        //                 fullName: employee.name,
        //                 lastNameFirstName: employee.name,
        //                 firstName: employee.fname,
        //                 lastName: employee.lname,
        //                 cellPhone: employee.cellPhone,
        //                 homePhone: employee.homePhone,
        //                 email: employee.email,
        //             });
        //             this.fourthFormGroup.patchValue({
        //                 dob: moment(employee.dob)
        //                     .subtract(1, 'week')
        //                     .hour(18)
        //                     .minute(56)
        //                     .toISOString(),
        //                 maritalStatus: employee.martialStatus,
        //                 address1: employee.address1,
        //                 address2: employee.address2,
        //                 city: employee.town,
        //                 province: employee.state,
        //                 postalCode: employee.postalCode,
        //                 country: employee.country,
        //                 usCitizen: employee.citizenStatus,
        //                 license: employee.tractorStatus,
        //                 passport: employee.passport,
        //                 //   imageURL: employee.imageURL,
        //                 avatar: employee.avatar,
        //             });
        //             this.fifthFormGroup.patchValue({
        //                 firstQuestion: employee.fifthQuestion,
        //                 secondQuestion: employee.secondQuestion,
        //                 thirdQuestion: employee.thirdQuestion,
        //                 fourthQuestion: employee.fourthQuestion,
        //                 fifthQuestion: employee.fifthQuestion,
        //                 workExperience: employee.workExperience,
        //                 job: employee.job,
        //                 supervisor: employee.supervisor,
        //                 supervisorContact: employee.supervisorContact,
        //             });
        //             this.sixthFormGroup.patchValue({
        //                 e_firstQuestion: employee.e_firstQuestion,
        //                 e_secondQuestion: employee.e_secondQuestion,
        //                 e_thirdQuestion: employee.e_thirdQuestion,
        //             });
        //             this.seventhFormGroup.patchValue({
        //                 degree: employee.name,
        //                 institution: employee.name,
        //                 education: employee.name,
        //             });
        //             this._changeDetectorRef.markForCheck();
        //         });
        // } 
    }
    // #endregion

    submit(): void {
        this.form = this._formBuilder.group({});
        this.formArr.forEach((f)=>{
            Object.entries(f.value).forEach(element => {
                const control = this._formBuilder.control(
                 element[1]
                )
               this.form.addControl(element[0], control)
             });
        })
    }

    discard(): void {
        // Close the dialog
        this.matDialogRef.close();
    }
   
    selectionChange(event) {
        if (event.selectedIndex == 0) {
            this.isBack = false;
        } else {
            this.isBack = true;
        }
        event.selectedIndex == 5
            ? (this.isSubmit = true)
            : (this.isSubmit = false);
    }

    showPreview(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.fourthFormGroup.patchValue({
            avatar: file,
        });
        this.fourthFormGroup.get('avatar').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
