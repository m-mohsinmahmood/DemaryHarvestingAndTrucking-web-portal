/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { ApplicantPagination, Applicant } from 'app/modules/admin/apps/applicants/applicants.types';
import { applicantNavigationLeft,applicantNavigationRight } from './applicantnavigation';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { AlertService } from 'app/core/alert/alert.service';

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

    
    
    // #endregion

    // #region Applicants & Applicant
    // Data
    // private applicantList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    // readonly applicantList$: Observable<any[] | null> = this.applicantList.asObservable();

    // private applicant: BehaviorSubject<any | null> = new BehaviorSubject(null);
    // readonly applicant$: Observable<any | null> = this.applicant.asObservable();

    // // Loaders
    // private isLoadingApplicantList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // readonly isLoadingApplicantList$: Observable<boolean> = this.isLoadingApplicantList.asObservable();

    // private isLoadingApplicant: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // readonly isLoadingApplicant$: Observable<boolean> = this.isLoadingApplicant.asObservable();
    // #endregion

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService
    ) {}

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<ApplicantPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for applicant
     */
    // get applicant$(): Observable<Applicant> {
    //     return this._applicantdata.asObservable();
    // }

    /**
     * Getter for applicant
     */
    get applicantdata$(): Observable<Applicant[]> {
        return this._applicantsdata.asObservable();
    }

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
                message: error.error.message,
                time: 6000,
            });
        }
        return throwError(errorMessage);
    }
    //#endregion

    /**
     * Get applicants
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getApplicants(page: number = 1, limit: number = 10, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '') {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
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

    /**
     * Get applicant by id
     */
     getApplicantById(id: string) {
        this._httpClient
            .get(`api-1/applicants?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(true);
                    this.applicant.next(res);
                    this.isLoadingApplicant.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    /**
     * Create applicant
     */
     createApplicant(data: any) {
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
                    this.getApplicants();
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
    deleteApplicant(id: string) {
        this._httpClient
            .delete(`api-1/applicant?applicantId=${id}`)
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

    // #region Applicants & Applicant
    getApplicantDummy(
        page: number = 1,
        limit: number = 10,
        sort: string = '',
        order: 'asc' | 'desc' | '' = '',
        search: string = ''
    ) {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>('api-1/hahahahahahahaha', {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicants.next(true);
                    this.applicantsList.next(res);
                    this.isLoadingApplicants.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    getApplicantByIdDummy(id: string) {
        this._httpClient
            .get(`api-1/customers?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(true);
                    this.applicantList.next(res);
                    this.isLoadingApplicant.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    createApplicantDummy(data: any) {
        this._httpClient
            .post(`api-1/customers`, data)
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
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getApplicantDummy();
                }
            );
    }

    updateApplicantDummy(customerData: any, paginatioData: any) {
        this._httpClient
            .put(`api-1/customers`, customerData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingApplicant.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Success',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                },
                () => {
                    this.getApplicantDummy(customerData.id);
                }
            );
    }
    //#endregion
}
