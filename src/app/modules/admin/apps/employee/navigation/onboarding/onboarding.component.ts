import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from './compose/compose.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
    items=[];
    folders=[];
    block: any;

    isLoading: boolean = false;
    routeID; // URL ID
    panelOpenState = false;
    statusList: string[] = ['Hired', 'Evaluated', 'In-Process', 'New', 'N/A', 'Not Being Considered'];
    country_list = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
    routesLeft = [];
    routesright = [];
    selectedIndex: string = 'Applicant Data';
    isEdit: boolean;
    applicant: any;
    routes: any;
    data: any;
    statusStep: string = '3';
    statusMessage: string = 'Application Submitted';
    preliminaryReviewForm: FormGroup;
    interviewCompletedForm: FormGroup;
    decisionMadeForm: FormGroup;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;


  constructor(private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void {
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
    recruiter_id: [{value: '', disabled: true}],
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
    recruiter_id: [{value: '', disabled: true}],
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



    this.folders =[
        {folder:'DOI'},
        {folder:'DOT'},
        {folder:'Payroll'},
        {folder:'DHS'},
        {folder:'Documents'},
    ];
    // on page rending of Folder
    this.block = 'DOI';
  }

  openComposeDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(MailboxComposeComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }
    onClick(foldename: any){
        console.log('first',foldename.folder);
        this.block = foldename.folder;
    }

}