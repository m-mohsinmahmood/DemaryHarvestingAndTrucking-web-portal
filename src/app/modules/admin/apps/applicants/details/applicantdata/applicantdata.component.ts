import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject } from 'rxjs';
import { ApplicantService } from '../../applicants.services';

@Component({
  selector: 'app-applicantdata',
  templateUrl: './applicantdata.component.html',
  styleUrls: ['./applicantdata.component.scss']
})
export class ApplicantdataComponent implements OnInit {
    panelOpenState = false;
    applicant$: Observable<any>;
    isLoadingApplicant$: Observable<any>;
    routes: any;
    applicants$: Observable<any>;
    routeID; // URL ID


    private _unsubscribeAll: Subject<any> = new Subject<any>();



  constructor(
    private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.id;
  });
    this._applicantService.getApplicantById(this.routeID);
    this.applicant$ = this._applicantService.applicant$;
    // Loader
    this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;


  }

//   ngAfterViewInit(): void {
//     this.initApis(this.routeID);
//     this.initObservables();
// }


//     //#region Initial APIs
//     initApis(id: string) {
//       this._applicantService.getApplicantById(id);
//   }
//   //#endregion

//   //#region Initialize Observables
//   initObservables() {
//       // Data
//       this.applicant$ = this._applicantService.applicant$;
//       // Loader
//       this.isLoadingApplicant$ = this._applicantService.isLoadingApplicant$;
//   }
  //#endregion

}
