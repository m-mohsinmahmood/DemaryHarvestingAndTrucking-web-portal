import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
    items=[];
    folders=[];
  constructor() { }

  ngOnInit(): void {
    this.items = [
        {content:'Offer Accepted',name:'', date:'15/02/2022', status:'a'},
        {content:'New DHT account created',name:'', date:'15/02/2022', status:'b'},
        {content:'Upload passport and driving license',name:'', date:'15/02/2022',status:'c'},
        {content:'Review/Sign compliance docs',name:'', date:'15/02/2022',status:'d1'},
        {content:'Review/complete VISA App', name:'', date:'15/02/2022',status:'e1'},
        {content:'VISA interview date entered into system', name:'Contact and approval letter reviewed/approved', date:'15/02/2022',status:'e1'},
        {content:'Contrat signed', name:'Contract signed', date:'15/02/2022',status:'e1'},
        {content:'Online bank account created/entered', name:'Martha Grander', date:'15/02/2022',status:'e1'},
        {content:'Remained docs completed', name:'Administrator reviews/edits status, as necessary', date:'15/02/2022',status:'e1'},
        {content:'Not Qualified', name:'rejected', date:'15/02/2022',status:false},
        {content:'Reconsider in Future', name:'rejected', date:'15/02/2022',status:false},
    ];
    this.folders =[
        {folder:'DOI'},
        {folder:'DOT'},
        {folder:'DHT'},
        {folder:'Payroll'},
        {folder:'DHS'},
        {folder:'Summary'}

    ];
  }

}
