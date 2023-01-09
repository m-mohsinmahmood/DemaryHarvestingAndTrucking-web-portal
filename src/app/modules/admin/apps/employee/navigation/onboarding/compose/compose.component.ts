import { EmployeeService } from './../../../employee.service';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector: 'mailbox-compose',
    templateUrl: './compose.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MailboxComposeComponent implements OnInit {

    //#region email variables
    emails: any;
    email_text: string;
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
    //#region Status Bar Variables
    current_status_step;
    current_status_message;
    next_status_step;
    next_status_message;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _employeeService: EmployeeService,
        @Inject(MAT_DIALOG_DATA) public data: any

    ) {
    }

    //#region Lifecycle hooks
    ngOnInit(): void {
        this.initEmails();
        this.patchForm();
        this.updateEmailForm();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Initilize Emails
    initEmails() {
        this.emails = [
            {
                id: '1', subject: 'DHT “Onboarding Process” (Step 1 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ',</br>We appreciate your interest in DHT and are looking forward to working with you this upcoming season. To complete your pre-employment (onboarding) process in compliance with US Government regulations, we are required to collect several forms. This email is the first of several steps, you will need to complete to become employed by DHT.  Please note that all your personal information and documentation is confidential, protected and can be accessed anytime from your personal online DHT account.</br></br>Please visit your newly set-up DHT account at demarayharvesting.com and begin the process by uploading your social security number and driver’s license information.  Thanks again for your patience and timely cooperation in gathering all required documentation.</br></br>Kind regards, '
            },
            {
                id: '2', subject: 'DHT “Onboarding Process” (Step 2 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ',</br>Thanks for successfully uploading your passport and driver’s license.  Next, we will need you to carefully review, read, and electronically sign the four compliance related documents below.  Your electronic signature will be used as verification that you’ve read and understood the contents of these documents. Thanks for your help in gathering this documentation.</br></br>Kind regards,'
            },
            {
                id: '3', subject: 'DHT “Onboarding Process” (Step 3 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br>Thanks for successfully signing the required DHT and US Government compliance documentation. Next, we will we need you to review, complete, and electronically sign the attached DHT Contract Letter and W4 tax form.</br></br>Kind regards,'
            },
            {
                id: '4', subject: 'DHT “Onboarding Process” (Step 4 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br>Thanks for successfully signing the DHT Contract Letter and W4 tax form.  Next, to ensure that there are no delays in getting paid, we require all employees set-up an online bank account. Once you’ve successfully created an online bank account, you will need to visit your DHT online account at demarayharvesting.com to enter the appropriate bank account information.</br></br>Kind regards,'
            },
            {
                id: '5', subject: 'DHT “Onboarding Process” (Step 5 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br>Thanks for setting up your online bank account.  You are almost finished with the pre-employment (onboarding) process.</br></br>Next, we will need you to carefully review, read, and electronically sign and date the two required DHT compliance documents below.  Thanks again for your help in completing this step.</br></br>Kind regards,'
            },
            {
                id: '6', subject: 'DHT “Onboarding Process” (Step 6 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br>Thanks for completing the recent compliance documents.</br></br>In advance of your scheduled start date, we ask all employees who do not currently have their CDL license to review the attached CDL training instructions and website to help study and prepare for their CDL test upon arrival.</br></br>Kind regards,'
            },
            {
                id: '7', subject: 'DHT “Onboarding Process” (Step 7 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br>Congratulations you are now officially ready to start your DHT job in the upcoming Harvesting season.  Please reach out to your recruiter to schedule your arrival date and make related travel arrangements.  We are excited to welcome you to the US and into the DHT family.  Please don’t hesitate to reach out if you have any further questions before your scheduled start date.See you soon!</br></br>Kind regards,'
            },
        ];
    }

    //#region Patch form 
    patchForm() {
        const { employee } = this.data;
        this.current_status_step = employee.status_step;
        this.current_status_message = employee.status_message;
        this.data.form.patchValue({
            to: employee.email,
            id: employee.employee_id,
        });
    }
    //#endregion

    //#region Compose Email
    updateEmailForm() {
        if (this.current_status_step == '2') {
            this.patchEmail(3,0)  
        }
        else if (this.current_status_step == '4'){
            this.patchEmail(5,1)
        }
        else if (this.current_status_step == '7'){
            this.patchEmail(8,2)
        }
        else if (this.current_status_step == '8'){
            this.patchEmail(9,3)
        }
        else if (this.current_status_step == '10'){
            this.patchEmail(11,4)
        }
        else if (this.current_status_step == '12'){
            this.patchEmail(13,5)
        }
        else if (this.current_status_step == '14'){
            this.patchEmail(15,6)
        }
        else if (this.current_status_step == '16'){
            this.patchEmail(17,7)
        }

    }

    patchEmail(step,emailIndex){
        this.next_status_step = step;
        this.email_text = this.emails[emailIndex].email;
        this.data.form.patchValue(
            {
                subject: this.emails[emailIndex].subject,
                body: this.emails[emailIndex].email,
                prev_status_step: this.current_status_step,
                prev_status_message: this.current_status_message,
                status_step: step,
                status_message: 'Inprogress'
            },
            {
                emitEvent: false,
                onlySelf: true
            }
        );
    }

    //#endregion

    //#region  Form methods

    discard(): void {
        this.matDialogRef.close();
    }


    send(): void {
        this.data.form.value['body'] = this.email_text;
        this._employeeService.patchEmployee(
            Object.assign(this.data.form.value, { to: this.data.employee.email })
        );
        this.matDialogRef.close();
        this.data.form.reset();
    }
    //#endregion
}
