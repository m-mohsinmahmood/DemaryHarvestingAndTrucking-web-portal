import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { ApplicantPagination, Applicant } from 'app/modules/admin/apps/applicants/applicants.types';
import { applicantNavigation,applicantNavigation2 } from './applicantnavigation';

@Injectable({
    providedIn: 'root'
})
export class ApplicantService
{
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
    public navigationLabels = applicantNavigation;
    public navigationLabels2 = applicantNavigation2;



    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<ApplicantPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for applicant
     */
    get applicant$(): Observable<Applicant>
    {
        return this._applicantdata.asObservable();
    }

    /**
     * Getter for applicant
     */
    get applicantdata$(): Observable<Applicant[]>
    {
        return this._applicantsdata.asObservable();
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
    getApplicants(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: ApplicantPagination; products: Applicant[] }>
    {
        return this._httpClient.get<{ pagination: ApplicantPagination; products: Applicant[] }>('api/apps/applicants', {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._applicantsdata.next(response.products);
            })
        );
    }

    /**
     * Get applicant by id
     */
    getApplicantById(id: string): Observable<Applicant>
    {
        console.log('ID::',id)
        return this._applicantsdata.pipe(
            take(1),
            map((applicants) => {
                console.log('first',applicants)
                // Find the applicant
                const applicant = applicants.find(item => item.id === id) || null;
              console.log('d',applicant)
                // Update the applicant
                this._applicantdata.next(applicant);

                // Return the applicant
                return applicant;
            }),
            switchMap((applicant) => {

                if ( !applicant )
                {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(applicant);
            })
        );
    }

    /**
     * Create applicant
     */
    createApplicant(): Observable<Applicant>
    {
        return this.applicantdata$.pipe(
            take(1),
            switchMap(applicants => this._httpClient.post<Applicant>('api/apps/applicants/product', {}).pipe(
                map((newApplicant) => {

                    // Update the applicant with the new product
                    this._applicantsdata.next([newApplicant, ...applicants]);

                    // Return the new applicant
                    return newApplicant;
                })
            ))
        );
    }

    /**
     * Update applicant
     *
     * @param id
     * @param applicant
     */
    updateApplicant(id: string, applicant: Applicant): Observable<Applicant>
    {
         console.log('app--',applicant, id)
        return this.applicantdata$.pipe(
            take(1),
            switchMap(applicants => this._httpClient.patch<Applicant>('api/apps/applicants/product', {
                id,
                applicant
            }).pipe(
                map((updatedApplicant) => {
                    console.log('updated-product:',updatedApplicant);

                    // Find the index of the updated applicant
                    const index = applicants.findIndex(item => item.id === id);

                    // Update the applicant
                    applicants[index] = updatedApplicant;

                    // Update the applicants
                    this._applicantsdata.next(applicants);

                    // Return the updated applicant
                    console.log('updated-product:',updatedApplicant);
                    return updatedApplicant;

                }),
                switchMap(updatedApplicant => this.applicant$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the applicant if it's selected
                        this._applicantdata.next(updatedApplicant);

                        // Return the updated applicant
                        return updatedApplicant;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the applicant
     *
     * @param id
     */
     deleteApplicant(id: string): Observable<boolean>
    {
        return this.applicantdata$.pipe(
            take(1),
            switchMap(applicants => this._httpClient.delete('api/apps/applicants/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted applicant
                    const index = applicants.findIndex(item => item.id === id);

                    // Delete the applicant
                    applicants.splice(index, 1);

                    // Update the applicants
                    this._applicantsdata.next(applicants);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }








}
