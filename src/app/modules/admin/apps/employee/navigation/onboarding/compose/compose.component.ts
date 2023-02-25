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
    h2a_emails: { id: string; subject: string; email: string; }[];
    //#endregion

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _employeeService: EmployeeService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    //#region Lifecycle hooks
    ngOnInit(): void {
        if (this.data.employee.country == 'United States of America') {
            this.initEmails();
            this.patchForm();
            this.updateEmailForm();
        }
        else {
            this.initH2aEmails();
            this.patchH2aForm();
            this.updateH2aEmailForm();
        }
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
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>We appreciate your interest in DHT and are looking forward to working with you this upcoming season. To complete your pre-employment (onboarding) process in compliance with US Government regulations, we are required to collect several forms. This email is the first of several steps, you will need to complete to become employed by DHT.  Please note that all your personal information and documentation is confidential, protected and can be accessed anytime from your personal online DHT account.</br></br>Please visit your newly set-up DHT account at demarayharvesting.com and begin the process by uploading your social security number (Payroll Document Folder) and driver’s license (DOT Document Folder) information.  Thanks again for your patience and timely cooperation in gathering all required documentation. Note, the DHT administrator will send you another email once these two documents have been successfully uploaded and verified.  We appreciate your patience with this process.  </br></br>Kind regards, '
            },
            {
                id: '2', subject: 'DHT “Onboarding Process” (Step 2 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ',</br></br>Thanks for successfully uploading your Social Security Card  and Drivers license.  Next, we will need you to carefully review, read, and electronically sign the four compliance related documents below.  Your electronic signature will be used as verification that you’ve read and understood the contents of these documents. Thanks for your help in gathering this documentation.</br></br>Ag Work Agreement (DHS Documents Folder) </br>Work itinerary (DHS Documents Folder) </br>DHT work rules (Company Documents Folder) </br>Handbook (Company Documents Folder)</br></br>Note, the DHT administrator will send you another email once these four documents have been successfully reviewed/signed.  We appreciate your patience with this process.</br></br> Kind regards,'
            },
            {
                id: '3', subject: 'DHT “Onboarding Process” (Step 3 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br></br>Thanks for successfully signing the required DHT and US Government compliance documentation. Next, we will we need you to review, complete, and electronically sign the attached DHT Contract Letter (DOI Document Folder) and W4 tax (Payroll Document Folder) form. Note, the DHT administrator will send you another email once these two documents have been successfully reviewed/signed.  We appreciate your patience with this process.</br></br>Kind regards,'
            },
            {
                id: '4', subject: 'DHT “Onboarding Process” (Step 4 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br></br>Thanks for successfully signing the DHT Contract Letter and W4 tax form.  Next, to ensure that there are no delays in getting paid, we require all employees set-up an online bank account (Payroll Document Folder). Once you’ve successfully created an online bank account, you will need to visit your DHT online account at demarayharvesting.com to enter the appropriate bank account information. Note, the DHT administrator will send you another email once your bank account information has been successfully uploaded.  We appreciate your patience with this process. </br></br>Kind regards,'
            },
            {
                id: '5', subject: 'DHT “Onboarding Process” (Step 5 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br></br>Thanks for setting up your online bank account.  You are almost finished with the pre-employment (onboarding) process.</br></br>Next, we will need you to carefully review and electronically sign the four required DHT Company documents including 1) Drug Policy, 2) Reprimand Policy, 3) Equipment Policy, and 4) Departure Policy (all 4 documents located in the Company Documents Folder).</br></br></br></br>Kind regards,'
            },
            {
                id: '6', subject: 'DHT “Onboarding Process” (Step 6 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br></br>Thanks for completing the recent DHT Company documents.</br></br>In advance of your scheduled start date, we ask all employees who do not currently have their CDL license to review the CDL training instructions and video links (DHT Company docs folder) to help study and prepare for their CDL test upon arrival.</br></br>Kind regards,'
            },
            {
                id: '7', subject: 'DHT “Onboarding Process” (Step 7 of 7)',
                email: 'Dear ' + this.data.employee.first_name + ', </br></br>Congratulations you are now officially ready to start your DHT job in the upcoming Harvesting season.  Please reach out to your recruiter to schedule your arrival date and make related travel arrangements.  We are excited to welcome you to the US and into the DHT family.  Please don’t hesitate to reach out if you have any further questions before your scheduled start date.See you soon!</br></br>Kind regards,'
            },
        ];
    }
    //#endregion

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
            this.patchEmail(3, 0)
        }
        else if (this.current_status_step == '4') {
            this.patchEmail(5, 1)
        }
        else if (this.current_status_step == '6') {
            this.patchEmail(7, 2)
        }
        else if (this.current_status_step == '8') {
            this.patchEmail(9, 3)
        }
        else if (this.current_status_step == '10') {
            this.patchEmail(11, 4)
        }
        else if (this.current_status_step == '12') {
            this.patchEmail(13, 5)
        }
        else if (this.current_status_step == '14') {
            this.patchEmail(15, 6)
        }
        else if (this.current_status_step == '16') {
            this.patchEmail(17, 7)
        }

    }

    patchEmail(step, emailIndex) {
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


    //#region H2A
    initH2aEmails() {
        this.h2a_emails = [
            {
                id: '1', subject: 'DHT “Onboarding Process” (Step 1 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>We appreciate your interest in DHT and are looking forward to working with you this upcoming season. To complete your pre-employment (onboarding) process in compliance with US Government regulations, we are required to collect several forms.</br></br>This email is the first of several steps, you will need to complete to become employed by DHT. Please note that all your personal information and documentation is confidential, protected and can be accessed anytime from your personal online DHT account. Please visit your newly set-up DHT account and begin the process by uploading your Passport (DOI Document Folder), Driver’s license (DOT Document Folder), and Social Security Card (Payroll Folder, which you likely will not have for several weeks until after you’ve arrived in the U.S.) to the Employee Dashboard (look for the Rocketship icon). To be clear, If you dont yet have a Social Security Card, please skip this document at this stage.</br></br>Thanks again for your patience and timely cooperation in gathering all required documentation.  Note, the DHT administrator will send you another email once these documents have been successfully uploaded and verified.  We appreciate your patience with this process.</br></br>Kind regards,</br></br>'
            },
            {
                id: '2', subject: 'DHT “Onboarding Process” (Step 2 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for successfully uploading your Passport and Driver’s License. In advance of your scheduled start date, we ask all employees who do not currently have their CDL license to review and verify the CDL training instructions document located in the DHT folder in the web portal to help study and prepare for their CDL test upon arrival.</br></br>Kind regards,'
            },
            {
                id: '3', subject: 'DHT “Onboarding Process” (Step 3 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for reviewing and verifying the CDL Training instructions.  Next, please visit your web portal to view and verify you have read the following eight (8) DHT Compliance documents.</br></br>1. Ag Work Agreement (DOL)</br>2. Work Itinerary (DOL)</br>3. Work Policies (DHT)</br>4. Employee Handbook (DHT)</br>5. Drug Policy (DHT)</br>6. Reprimand Policy (DHT)</br>7. Equipment Policy (DHT)</br>8.Departure Policy (DHT)</br></br>After this is complete, the DHT administrator will send you another email on next steps.  We appreciate your patience with this process. </br></br>Kind regards,</br></br> '
            },
            {
                id: '4', subject: 'DHT “Onboarding Process” (Step 4 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for successfully signing the required DHT and US Government compliance documentation. Next, we will need you to review the attached DHT Employee Contract(DOI Folder) to make sure its contents are correct.  If this information is correct, please review, sign, and date the Contract.  Once complete, the DHT administrator will send you another email with more information regarding the next onboarding step which is to set up an online bank account.  We appreciate your patience with this process.</br></br>Kind regards,</br></br>'
            },
            {
                id: '5', subject: 'DHT “Onboarding Process” (Step 5 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for successfully signing the DHT Contract Letter. Next, to ensure that there are no delays in getting paid, we require all employees set-up an online bank account before they arrive in the United States. In prior years, most of our employees have used a banking organization called Transferwise. We have provided instructions in the Company Documents folder (on the main navigation bar) to set-up a Transferwise account for your convenience, if interested.</br></br>Once you’ve successfully created an online bank account, you will need to visit your DHT web portal to enter the appropriate bank account information in the Payroll folder. Once complete, the DHT administrator will send you another email with more information regarding the next onboarding step.</br></br>Kind regards,</br</br>  '
            },
            {
                id: '6', subject: 'DHT “Onboarding Process” (Step 6 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for successfully setting up your online bank account. Next, we will need you to apply for your VISA application. Please note that we have uploaded some instructions to your Company Document folder in the DHT web portal that provides you with more detailed information on how to complete your VISA application.  Importantly, you will need the OEI number from I-797B form (located in the DOI folder) in order to complete your VISA application.  As a reminder, the I-797B form will also need to be reviewed and verified in order to move to the next onboarding step.</br></br>As part of the VISA application process, you will need to request a VISA interview date.  NOTE:  PLEASE DO NOT SCHEDULE AN INTERVIEW DATE LESS THAN THREE WEEKS PRIOR TO YOUR ARRIVAL DATE.  IF YOU ARE NOT ABLE TO DO THIS, PLEASE REVIEW THE VISA INSTRUCTIONS IN THE COMPANY DOCUMENTS FOLDER FOR NEXT STEPS.</br></br>After you’ve received an acceptable VISA interview date (e.g., an interview date that takes place at least 3 weeks prior to your start date), you will then need to enter the interview date and consulate details into your online DHT account located within the DOI folder.</br></br>Kind regards,</br></br>'
            },
            {
                id: '7', subject: 'DHT “Onboarding Process” (Step 7 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Congratulations on successfully completing your VISA application and setting up your interview date. You are almost finished with the pre-employment (onboarding) process. Next, please review and verify your DHT Approval Letter located in the DOI folder in the web portal.  As a reminder, please remember to bring the 797B certificate, your Contract and the DHT approval letter with you to the VISA Interview.</br></br>Kind regards</br></br>'
            },
            {
                id: '8', subject: 'DHT “Onboarding Process” (Step 8 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thank you for verifying your Approval Letter.  Once you receive your VISA, please log-in to the web portal and upload a picture of your VISA and enter the relevant information in the VISA form located in the DOL folder.  Once verified by the administrator, the administrator will send you a follow-up email with applicable next steps.</br></br>Kind regards,</br></br>'
            },
            {
                id: '9', subject: 'DHT “Onboarding Process” (Step 9 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thank you for successfully uploading your VISA information.</br></br>As a next step, please reach out to your recruiter to schedule your arrival date and make related travel arrangements. We are excited to welcome you to the US and into the DHT family.</br></br>Additionally, please note that after you’ve arrived in the U.S. you will be receiving five (5) additional documents (listed below) FROM THE ADMINISTRATOR (via EMAIL) that you will need to upload to the web portal.  Once these five (5) documents have been successfully uploaded, the administrator will send a follow-up email explaining the final onboarding steps.</br></br>1. I-94 (DOL)</br>2. I-9 (DOL)</br>3. Physical (DOT)</br>4. Drug Test (DOT)</br>5. E-Verify (DOL)</br></br>Kind regards,</br></br>'
            },
            {
                id: '10', subject: 'DHT “Onboarding Process” (Step 10 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thanks for successfully uploading the five (5) additional H2A documents.  Next, once you receive your new Social Security card, you’ll need to upload a photo of this and enter the relevant information in the payroll folder.  Once verified, the administrator will send you a follow-up email on applicable next steps.</br></br>Kind regards,</br></br>'
            },
            {
                id: '11', subject: 'DHT “Onboarding Process” (Step 11 of 12)',
                email: 'Dear ' + this.data.employee.first_name + 
                ',</br></br>Thank you for posting your Social Security Card information to the web portal.  The final step is to upload a photo of your American Drivers license and enter the relevant information in the American Drivers License form in the DOT folder and if applicable your CDL Drivers license information.  Once complete, you will receive a confirmation email from the administrator.</br></br>Kind regards,'
            },
            {
                id: '12', subject: 'DHT “Onboarding Process” (Step 12 of 12)',
                email: 'Dear ' + this.data.employee.first_name + ',</br></br>Congratulations you are now officially ready to start your DHT job in the upcoming Harvesting season!  We are looking forward to a great year!</br></br>Kind regards</br></br>'
            },
        ];
    }
    patchH2aForm() {

        const { employee } = this.data;
        this.current_status_step = employee.status_step;
        this.current_status_message = employee.status_message;
        this.data.form.patchValue({
            to: employee.email,
            id: employee.employee_id,
        });
    }
    updateH2aEmailForm() {
        if (this.current_status_step == '2') {
            this.patchH2aEmail(3, 0)
        }
        else if (this.current_status_step == '4') {
            this.patchH2aEmail(5, 1)
        }
        else if (this.current_status_step == '6') {
            this.patchH2aEmail(7, 2)
        }
        else if (this.current_status_step == '8') {
            this.patchH2aEmail(9, 3)
        }
        else if (this.current_status_step == '10') {
            this.patchH2aEmail(11, 4)
        }
        else if (this.current_status_step == '12') {
            this.patchH2aEmail(13, 5)
        }
        else if (this.current_status_step == '14') {
            this.patchH2aEmail(15, 6)
        }
        else if (this.current_status_step == '16') {
            this.patchH2aEmail(17, 7)
        }
        else if (this.current_status_step == '18') {
            this.patchH2aEmail(19, 8)
        }
        else if (this.current_status_step == '20') {
            this.patchH2aEmail(21, 9)
        }
        else if (this.current_status_step == '22') {
            this.patchH2aEmail(23, 10)
        }
        else if (this.current_status_step == '24') {
            this.patchH2aEmail(25, 11)
        }
        else if (this.current_status_step == '26') {
            this.patchH2aEmail(27, 12)
        }
    }

    patchH2aEmail(step, emailIndex) {
        this.next_status_step = step;
        this.email_text = this.h2a_emails[emailIndex].email;
        this.data.form.patchValue(
            {
                subject: this.h2a_emails[emailIndex].subject,
                body: this.h2a_emails[emailIndex].email,
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
            Object.assign(this.data.form.value, { to: this.data.employee.email }), this.data.employee.country == 'United States of America' ? 'false' : 'true'
        );
        this.matDialogRef.close();
        this.data.form.reset();
    }
    //#endregion
}
