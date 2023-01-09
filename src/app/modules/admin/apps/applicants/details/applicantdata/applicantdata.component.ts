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
    styleUrls: ['./applicantdata.component.scss'],
})
export class ApplicantdataComponent implements OnInit {
    allExpandState = false;
    applicant$: Observable<any>;
    isLoadingApplicant$: Observable<any>;
    routes: any;
    applicants$: Observable<any>;
    routeID; // URL ID
    applicant: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.id;
        });
        this.applicant$ = this._applicantService.applicant$;
    }

    downloadResume(link) {
        window.open(link, "_blank");
    }
}
