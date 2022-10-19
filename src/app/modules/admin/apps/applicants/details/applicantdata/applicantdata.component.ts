import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-applicantdata',
  templateUrl: './applicantdata.component.html',
  styleUrls: ['./applicantdata.component.scss']
})
export class ApplicantdataComponent implements OnInit {
    panelOpenState = false;

  constructor() {}

  ngOnInit(): void {
  }

}
