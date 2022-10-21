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
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> =
        this.closeDialog.asObservable();
   //#endregion

    // #region Applicants & Applicant

    // Data
    private applicantsList: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );
    readonly applicantsList$: Observable<any[] | null> =
        this.applicantsList.asObservable();

    private applicantList: BehaviorSubject<any | null> = new BehaviorSubject(
        null
    );
    readonly applicantList$: Observable<any | null> =
        this.applicantList.asObservable();

    // Loaders
    private isLoadingApplicants: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    readonly isLoadingApplicants$: Observable<boolean> =
        this.isLoadingApplicants.asObservable();

    isLoadingApplicant: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    readonly isLoadingApplicant$: Observable<boolean> =
        this.isLoadingApplicant.asObservable();
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
    get applicant$(): Observable<Applicant> {
        return this._applicantdata.asObservable();
    }

    /**
     * Getter for applicant
     */
    get applicantdata$(): Observable<Applicant[]> {
        return this._applicantsdata.asObservable();
    }

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
    getApplicants(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: ApplicantPagination; products: Applicant[] }> {
        return this._httpClient
            .get<{ pagination: ApplicantPagination; products: Applicant[] }>(
                'api/apps/applicants',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._applicantsdata.next(response.products);
                })
            );
    }

    /**
     * Get applicant by id
     */
    getApplicantById(id: string): Observable<Applicant> {
        console.log('ID::', id);
        return this._applicantsdata.pipe(
            take(1),
            map((applicants) => {
                console.log('first', applicants);
                // Find the applicant
                const applicant =
                    applicants.find((item) => item.id === id) || null;
                console.log('d', applicant);
                // Update the applicant
                this._applicantdata.next(applicant);

                // Return the applicant
                return applicant;
            }),
            switchMap((applicant) => {
                if (!applicant) {
                    return throwError(
                        'Could not found product with id of ' + id + '!'
                    );
                }

                return of(applicant);
            })
        );
    }

    /**
     * Create applicant
     */
    createApplicant(): Observable<Applicant> {
        return this.applicantdata$.pipe(
            take(1),
            switchMap((applicants) =>
                this._httpClient
                    .post<Applicant>('api/apps/applicants/product', {})
                    .pipe(
                        map((newApplicant) => {
                            // Update the applicant with the new product
                            this._applicantsdata.next([
                                newApplicant,
                                ...applicants,
                            ]);

                            // Return the new applicant
                            return newApplicant;
                        })
                    )
            )
        );
    }

    /**
     * Update applicant
     *
     * @param id
     * @param applicant
     */
    updateApplicant(id: string, applicant: Applicant): Observable<Applicant> {
        console.log('app--', applicant, id);
        return this.applicantdata$.pipe(
            take(1),
            switchMap((applicants) =>
                this._httpClient
                    .patch<Applicant>('api/apps/applicants/product', {
                        id,
                        applicant,
                    })
                    .pipe(
                        map((updatedApplicant) => {
                            console.log('updated-product:', updatedApplicant);

                            // Find the index of the updated applicant
                            const index = applicants.findIndex(
                                (item) => item.id === id
                            );

                            // Update the applicant
                            applicants[index] = updatedApplicant;

                            // Update the applicants
                            this._applicantsdata.next(applicants);

                            // Return the updated applicant
                            console.log('updated-product:', updatedApplicant);
                            return updatedApplicant;
                        }),
                        switchMap((updatedApplicant) =>
                            this.applicant$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the applicant if it's selected
                                    this._applicantdata.next(updatedApplicant);

                                    // Return the updated applicant
                                    return updatedApplicant;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the applicant
     *
     * @param id
     */
    deleteApplicant(id: string): Observable<boolean> {
        return this.applicantdata$.pipe(
            take(1),
            switchMap((applicants) =>
                this._httpClient
                    .delete('api/apps/applicants/product', { params: { id } })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted applicant
                            const index = applicants.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the applicant
                            applicants.splice(index, 1);

                            // Update the applicants
                            this._applicantsdata.next(applicants);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
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
