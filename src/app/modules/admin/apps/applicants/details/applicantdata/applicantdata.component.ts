import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
        public activatedRoute: ActivatedRoute,
        public _applicantService: ApplicantService,
        private _changeDetectorRef: ChangeDetectorRef,
        
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
    getCountryCode(country_code){
        if (country_code)
        return  '+' + country_code?.split("+")[1];
    }
}
