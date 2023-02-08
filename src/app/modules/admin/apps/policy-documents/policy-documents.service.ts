import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'; import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { AlertService } from 'app/core/alert/alert.service';

@Injectable({
    providedIn: 'root'
})
export class PolicyDocumentsService {
    // Private

    //#region Close Dialog
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> = this.closeDialog.asObservable();
    //#endregion

    //#region Policy Documents 
    private policyDocuments: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly policyDocuments$: Observable<any | null> = this.policyDocuments.asObservable();

    isLoadingPolicyDocuments: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly isLoadingPolicyDocuments$: Observable<any | null> = this.isLoadingPolicyDocuments.asObservable();
    //#endregion

    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService
    ) { }

   
    //#region Error 
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

    // Policy Documents 

    //#region Get Policy Documents
    getPolicyDocuments() {
        return this._httpClient
            .get(`api-1/policy-documents?type=${'global'}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingPolicyDocuments.next(true);
                    this.policyDocuments.next(res);
                    this.isLoadingPolicyDocuments.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    //#endregion

    //#region Patch Policy Documents
    addPolicyDocument(data: any) {
        this._httpClient
            .post(`api-1/policy-documents`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingPolicyDocuments.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Policy Documents',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingPolicyDocuments.next(false);
                },
                () => {
                     this.getPolicyDocuments();
                }
            );
    }
    //#endregion

    //#region Delete Policy Documents
    deletePolicyDocument(id: string) {
        this._httpClient
            .delete(`api-1/policy-documents?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingPolicyDocuments.next(true);
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getPolicyDocuments();
                    this.isLoadingPolicyDocuments.next(false);
                }
            );
    }

    //#endregion

}
