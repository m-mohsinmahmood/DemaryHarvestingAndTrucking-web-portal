import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { ApplicantPagination, Applicant, Country } from 'app/modules/admin/apps/applicants/applicants.types';
import { applicantNavigationLeft, applicantNavigationRight } from './applicantnavigation';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { AlertService } from 'app/core/alert/alert.service';
import { ApplicantFilters } from 'app/modules/admin/apps/applicants/applicants.types';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ApplicantService {
    patchValue(newProduct: Applicant) {
        throw new Error('Method not implemented.');
    }
    markForCheck() {
        throw new Error('Method not implemented.');
    }
    // Private

    private _pagination: BehaviorSubject<ApplicantPagination | null> = new BehaviorSubject(null);
    private _applicantdata: BehaviorSubject<Applicant | null> = new BehaviorSubject(null);
    private _applicantsdata: BehaviorSubject<Applicant[] | null> = new BehaviorSubject(null);
    public applicantNavigationLeft = applicantNavigationLeft;
    public applicantNavigationRight = applicantNavigationRight;
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);


    //#region Close Dialog
    closeDialog: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();
    //#endregion

    // #region Applicants & Applicant

    // Data
    private applicantList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    readonly applicantList$: Observable<any[] | null> = this.applicantList.asObservable();

    private applicant: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly applicant$: Observable<any | null> = this.applicant.asObservable();

    // Loaders
    private isLoadingApplicantList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingApplicantList$: Observable<boolean> = this.isLoadingApplicantList.asObservable();

    isLoadingApplicant: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingApplicant$: Observable<boolean> = this.isLoadingApplicant.asObservable();

    private applicantsList: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    readonly applicantsList$: Observable<any[] | null> =
        this.applicantsList.asObservable();
    // Loaders
    private isLoadingApplicants: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingApplicants$: Observable<boolean> =
        this.isLoadingApplicants.asObservable();

    //#endregion
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService,
        public _router: Router,

    ) { }

    //#region Getter
    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    get applicantdata$(): Observable<Applicant[]> {
        return this._applicantsdata.asObservable();
    }

    //#endregion

    //#region Error handling
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
            this._alertSerice.showAlert({
                type: 'error',
                shake: false,
                slideRight: true,
                title: 'Error',
                message: error.error.message,
                time: 6000,
            });
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            this._alertSerice.showAlert({
                type: 'error',
                shake: false,
                slideRight: true,
                title: 'Error',
                message: error.message,
                time: 6000,
            });
        }
        return throwError(errorMessage);
    }
    //#endregion

    //#region All Recruiter
    getDropdownAllRecruiters(search: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('search', search);
        return this._httpClient
            .get<any>(`api-1/dropdowns?entity=allRecruiters`, { params })
            .pipe(take(1))
    }

    //#endregion

    //#region Applicant API's 
    getApplicants(page: number = 1, limit: number = 50, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '', filters: ApplicantFilters = { state: '', created_at: '', status: '', ranking: '', date: '' },
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        params = params.set('state', filters.state);
        params = params.set('created_at', filters.created_at);
        params = params.set('status', filters.status);
        params = params.set('ranking', filters.ranking);
        params = params.set('date', filters.date);
        return this._httpClient
            .get<any>(`api-1/applicants`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicantList.next(true);
                    this.applicantList.next(res);
                    this.isLoadingApplicantList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    getApplicantById(id: string) {
        return this._httpClient
            .get(`api-1/applicants?id=${id}`)
            .pipe(take(1))
            ;

    }

    getApplicantByIdNew(id: string) {
        this.isLoadingApplicant.next(true);
        return this._httpClient
            .get(`api-1/applicants?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.applicant.next(res);
                    this.isLoadingApplicant.next(false);
                }
            );
    }

    createApplicant(data: any, landingPage: boolean) {
        this._httpClient
            .post(`api-1/applicants`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingApplicant.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Create Applicant',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingApplicant.next(false);
                },
                () => {
                    if (!landingPage) {
                        this.getApplicants();
                    } else if (landingPage) {
                        this._router.navigateByUrl("/pages/employment");

                    }
                }
            );
    }
    updateApplicant(data: any) {
        this._httpClient
            .put(`api-1/applicants`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Applicant',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingApplicant.next(false);
                },
                () => {
                    this.getApplicants();
                }
            );
    }
    patchApplicant(data: any, recruiterRemarks: boolean, skipEmail: boolean, applicantInfo?: any) {
        let newData;
        let url = recruiterRemarks ? `?type=recruiter` : `?type=status_bar`;
        if (recruiterRemarks) {
            const { ...applicant_data } = data;
            newData = Object.assign({}, { applicant_data }, { skipEmail });
            console.log('Recruiter', newData);
        } else {
            const { body, recruiter_id, subject, to, ...applicant_data } = data;
            const { id, status_step, status_message, reason_for_rejection, ...email_data } = data;
            newData = Object.assign({}, { applicant_data }, { email_data }, { skipEmail }, { applicantInfo });
        }

        this._httpClient
            .patch(`api-1/applicants${url}`, newData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Applicant',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingApplicant.next(false);
                },
                () => {
                    this.getApplicantByIdNew(newData.applicant_data.id);
                }
            );
    }
    deleteApplicant(id: string) {
        this._httpClient
            .delete(`api-1/applicants?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(true);
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getApplicants();
                    this.isLoadingApplicant.next(false);
                }
            );
    }
    //#endregion

    //#region get countries
    getCountries(): Observable<Country[]> {
        return this._httpClient.get<Country[]>('api/apps/employee/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }
    //#endregion
}
