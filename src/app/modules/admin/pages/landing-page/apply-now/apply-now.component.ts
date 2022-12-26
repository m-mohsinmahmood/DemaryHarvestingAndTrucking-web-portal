import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-apply-now',
  templateUrl: './apply-now.component.html',
  styleUrls: ['./apply-now.component.scss']
})

export class ApplyNowComponent implements OnInit {

  expectList = [
    {id: "1", listItem: "We welcome all American and Foreign workers (and have numerous H2A visas available for Foreign workers)."},
    {id: "2", listItem: "Prior experience with harvesting, farming, and trucking as well as mechanical and welding skills are important for being able to effectively contribute to DHT services."},
    {id: "3", listItem: "Extensive travel with mobile housing accommodations potentially covering many Southern and Midwest states."},
    {id: "4", listItem: "The recruiting process will include up to three online interviews and a reference check. Upon approval numerous documents will need to be signed and submitted online."},
    {id: "5", listItem: "Candidates are expected to prepare, study, and complete online CDL and safety training materials prior to arrival. This may also include attending online team meetings."},
    {id: "6", listItem: "Transportation to and from the airport will be provided for both arrival and departure."},
  ]
  requirementsList = [
    {"id": "1", "listItem": "Candidates must speak, read, and write English."},
    {"id": "2", "listItem": "Employees must pass a physical exam and pre-employment drug screen."},
    {"id": "3", "listItem": "Foreign workers will be required to secure a H2A Visa, complete a consulate interview, and apply for a US license and social security card upon arrival."},
    {"id": "4", "listItem": "Smart phone is required (a personal computer encouraged, but optional)."},
  ] 
  benifitsList = [
    {"id": "1", "listItem": "The US Department of Labor sets our minimum wage rates, and these rates differ by state and are adjusted periodically. Current rates provided during recruiting process."},
    {"id": "2", "listItem": "Modest living and kitchen facilities will be provided."},
    {"id": "3", "listItem": "One half airfare is reimbursed at the halfway point of the contract and the remaining amount will be reimbursed upon the completion of the contract."},
    {"id": "4", "listItem": "Workmen's compensation insurance is provided in the event of injury while working"},
    {"id": "5", "listItem": "Consulate fees will be reimbursed for approved candidates."},

  ] 

  constructor(
    public matDialogRef: MatDialogRef<ApplyNowComponent>,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  navigate(){
    this.router.navigateByUrl('pages/applicant');

  }

  //#region Dialog
  discard(): void {
    this.matDialogRef.close();
  }

}
