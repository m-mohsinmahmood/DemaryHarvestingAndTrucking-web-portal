import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'; import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { EmployeePagination, Employee, Country, Documents, Item } from 'app/modules/admin/apps/employee/employee.types';
import { employeeNavigation } from './employeeNavigation';
import { AlertService } from 'app/core/alert/alert.service';



@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    // Private
    public navigationLabels = employeeNavigation;
    public _employeedata: BehaviorSubject<Employee | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _documents: BehaviorSubject<Documents | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    //#region Close Dialog
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> = this.closeDialog.asObservable();
    //#endregion

    // #region Applicants & Applicant
    // Data
    private employeeList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    readonly employeeList$: Observable<any[] | null> = this.employeeList.asObservable();

    private employee: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly employee$: Observable<any | null> = this.employee.asObservable();

    // Loaders
    private isLoadingEmployeeList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingEmployeeList$: Observable<boolean> = this.isLoadingEmployeeList.asObservable();

    isLoadingEmployee: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingEmployee$: Observable<boolean> = this.isLoadingEmployee.asObservable();
    // #endregion

    //#region Employeee Documents
    // Data
    private employeeDocuments: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly employeeDocuments$: Observable<any | null> = this.employeeDocuments.asObservable();

    // Loaders
    private isLoadingEmployeeDocuments: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly isLoadingEmployeeDocuments$: Observable<any | null> = this.isLoadingEmployeeDocuments.asObservable();
    //#endregion

    //#Employee Dwr Region
    private employeeDwr: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly employeeDwr$: Observable<any | null> = this.employeeDwr.asObservable();

    private isLoadingEmployeeDwr: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly isLoadingEmployeeDwr$: Observable<any | null> = this.isLoadingEmployeeDwr.asObservable();

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

    //#region Getter

    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    get documents$(): Observable<Documents> {
        return this._documents.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    //#endregion

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


    //#region Applicant API's 
    getEmployees(page: number = 1, limit: number = 50, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '') {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', limit);
        params = params.set('search', search);
        params = params.set('sort', sort);
        params = params.set('order', order);
        return this._httpClient
            .get<any>(`api-1/employee`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeList.next(true);
                    this.employeeList.next(res);
                    this.isLoadingEmployeeList.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    getEmployeeById(id: string, h2a: string = 'false') {
        let params = new HttpParams();
        params = params.set('h2a', h2a);
        return this._httpClient
            .get(`api-1/employee?id=${id}`, {
                params,
            })
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployee.next(true);
                    this.employee.next(res);
                    this.isLoadingEmployee.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }

    createEmployee(data: any) {
        this._httpClient
            .post(`api-1/employee`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingEmployee.next(false);
                    //show notification based on message returned from the api
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Create Employee',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingEmployee.next(false);
                },
                () => {
                    this.getEmployees();
                }
            );
    }
    updateEmployee(id: string, data: any) {
        this._httpClient
            .put(`api-1/employee`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployee.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Employee',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingEmployee.next(false);
                },
                () => {
                    this.getEmployeeById(id);
                }
            );
    }

    deleteEmployee(id: string, fb_id:string, page , limit) {
        this._httpClient
            .delete(`api-1/employee?id=${id}&fb_id=${fb_id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployee.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Delete Employee',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getEmployees(page , limit);
                    this.isLoadingEmployee.next(false);
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

    //#region get Items
    getItems(folderId: string | null = null): Observable<Item[]> {
        return this._httpClient.get<Documents>('api/apps/employee/details', { params: { folderId } }).pipe(
            tap((response: any) => {
                this._documents.next(response);
            })
        );
    }

    getItemById(id: string): Observable<Item> {
        return this._documents.pipe(
            take(1),
            map((documents) => {

                // Find within the folders and files
                const item = [...documents.folders, ...documents.files].find(value => value.id === id) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {

                if (!item) {
                    return throwError('Could not found the item with id of ' + id + '!');
                }

                return of(item);
            })
        );
    }
    //#endregion

    //#region Patch Employee
    patchEmployee(data: any, h2a: string) {
        let newData;
        const { body, subject, to, ...employee_data } = data;
        const { id, status_step, prev_status_message, prev_status_step, status_message, ...email_data } = data;
        newData = Object.assign({}, { employee_data }, { email_data }, { h2a });
        this._httpClient
            .patch(`api-1/employee`, newData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployee.next(false);
                    this.closeDialog.next(true);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Update Employee',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.closeDialog.next(false);
                    this.isLoadingEmployee.next(false);
                },
                () => {
                    this.getEmployeeById(newData.employee_data.id, h2a);
                }
            );
    }
    //#endregion

    // Employee Documents Api functions

    //#region get employee docs
    getEmployeeDocs(id: string) {
        return this._httpClient
            .get(`api-1/employee-documents?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeDocuments.next(true);
                    this.employeeDocuments.next(res);
                    this.isLoadingEmployeeDocuments.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    //#endregion

    //#region Patch employee docs
    patchEmployeeDocuments(employeeId: string, employeeDoc: any) {
        this._httpClient
            .patch(`api-1/employee-documents`, employeeDoc)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeDocuments.next(false);
                    this._alertSerice.showAlert({
                        type: 'success',
                        shake: false,
                        slideRight: true,
                        title: 'Document has been submitted',
                        message: res.message,
                        time: 5000,
                    });
                },
                (err) => {
                    this.handleError(err);
                    this.isLoadingEmployeeDocuments.next(false);
                },
                () => {
                    this.getEmployeeDocs(employeeId);
                }
            );
    }

    //#endregion

    //#region Payroll 
    getPayrollById(id: string) {
        return this._httpClient
            .get(`api-1/employee-payroll?id=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeDwr.next(true);
                    this.employeeDwr.next(res);
                    this.isLoadingEmployeeDwr.next(false);
                },
                (err) => {
                    this.handleError(err);
                }
            );
    }
    //#endregion
    // Policy Documents 

    //#region Get Policy Documents
    getPolicyDocuments(id: string) {
        return this._httpClient
            .get(`api-1/policy-documents?id=${id}&type=${'personalized'}`)
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
    addPolicyDocument(data: any, employee_id:string) {
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
                    this.getPolicyDocuments(employee_id);
                }
            );
    }

    //#endregion

    //#region Delete Policy Documents
    deletePolicyDocument(id: string, employee_id: string) {
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
                    this.getPolicyDocuments(employee_id);
                    this.isLoadingPolicyDocuments.next(false);
                }
            );
    }

    //#endregion

}
