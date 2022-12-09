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
    private _pagination: BehaviorSubject<EmployeePagination | null> = new BehaviorSubject(null);
    private _employeesdata: BehaviorSubject<Employee[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _documents: BehaviorSubject<Documents | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);

    //#region Close Dialog
    closeDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly closeDialog$: Observable<boolean> = this.closeDialog.asObservable();
    //#endregion

    // #region Applicants & Applicant

    // Data
    private employeesList: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    readonly employeesList$: Observable<any[] | null> = this.employeesList.asObservable();

    private employeeList: BehaviorSubject<any | null> = new BehaviorSubject(null);
    readonly employeeList$: Observable<any | null> = this.employeeList.asObservable();

    // Loaders
    private isLoadingEmployeesList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingEmployeesList$: Observable<boolean> = this.isLoadingEmployeesList.asObservable();

    isLoadingEmployeeList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    readonly isLoadingEmployeeList$: Observable<boolean> = this.isLoadingEmployeeList.asObservable();
    // #endregion

    //#region 
    constructor(
        private _httpClient: HttpClient,
        private _alertSerice: AlertService
    ) {
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<EmployeePagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for employee
     */
    get employee$(): Observable<Employee> {
        return this._employeedata.asObservable();
    }

    /**
     * Getter for employees
     */
    get employeedata$(): Observable<Employee[]> {
        return this._employeesdata.asObservable();
    }

    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    /**
     * Getter for items
     */
    get documents$(): Observable<Documents> {
        return this._documents.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item> {
        return this._item.asObservable();
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


    //#region Applicant API's 
    // getEmployees(page: number = 1, limit: number = 10, sort: string = '', order: 'asc' | 'desc' | '' = '', search: string = '') {
    //     let params = new HttpParams();
    //     params = params.set('page', page);
    //     params = params.set('limit', limit);
    //     params = params.set('search', search);
    //     params = params.set('sort', sort);
    //     params = params.set('order', order);
    //     return this._httpClient
    //         .get<any>(`api-1/employees`, {
    //             params,
    //         })
    //         .pipe(take(1))
    //         .subscribe(
    //             (res: any) => {
    //                 this.isLoadingEmployeesList.next(true);
    //                 this.employeesList.next(res);
    //                 this.isLoadingEmployeesList.next(false);
    //             },
    //             (err) => {
    //                 this.handleError(err);
    //             }
    //         );
    // }
    // getEmployeeById(id: string) {
    //     return this._httpClient
    //         .get(`api-1/employee?id=${id}`)
    //         .pipe(take(1));
    // }

    createEmployee(data: any) {
        this._httpClient
            .post(`api-1/employees`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.closeDialog.next(true);
                    this.isLoadingEmployeeList.next(false);
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
                    this.isLoadingEmployeeList.next(false);
                },
                () => {
                    this.getEmployees();
                }
            );
    }
    updateEmployee(data: any) {
        this._httpClient
            .put(`api-1/employees`, data)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeList.next(false);
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
                    this.isLoadingEmployeeList.next(false);
                },
                () => {
                    this.getEmployees();
                }
            );
    }
    patchEmployee(data: any, recruiterRemarks: boolean) {
        let newData;
        let url = recruiterRemarks ? `?type=recruiter` : `?type=status_bar`;
        if (recruiterRemarks) {
            const { ...applicant_data } = data;
            newData = Object.assign({}, { applicant_data });
        }
        else {
            const { body, recruiter_id, subject, to, ...applicant_data } = data;
            const { id, status_step, status_message, ...email_data } = data
            newData = Object.assign({}, { applicant_data }, { email_data })
        }
        this._httpClient
            .patch(`api-1/employees${url}`, newData)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeList.next(false);
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
                    this.isLoadingEmployeeList.next(false);
                },
                () => {
                    this.getEmployeeById(newData.employee_data.id);
                    location.reload();
                }
            );
    }
    deleteEmployee(id: string) {
        this._httpClient
            .delete(`api-1/employee?employeeId=${id}`)
            .pipe(take(1))
            .subscribe(
                (res: any) => {
                    this.isLoadingEmployeeList.next(true);
                },
                (err) => {
                    this.handleError(err);
                },
                () => {
                    this.getEmployees();
                    this.isLoadingEmployeeList.next(false);
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


    /**
     * Get employees
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getEmployees(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: EmployeePagination; products: Employee[] }> {
        return this._httpClient.get<{ pagination: EmployeePagination; products: Employee[] }>('api/apps/employee', {
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
                this._employeesdata.next(response.products);
            })
        );
    }

    /**
     * Get employee by id
     */
    getEmployeeById(id: string): Observable<Employee> {
        return this._employeesdata.pipe(
            take(1),
            map((employees) => {
                // Find the employee
                const employee = employees.find(item => item.id === id) || null;

                // Update the employee
                this._employeedata.next(employee);

                // Return the employee
                return employee;
            }),
            switchMap((employee) => {

                if (!employee) {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(employee);
            })
        );
    }



    /**
     * Create product
     */
    // createEmployee(): Observable<Employee> {
    //     return this.employeedata$.pipe(
    //         take(1),
    //         switchMap(employees => this._httpClient.post<Employee>('api/apps/employee/product', {}).pipe(
    //             map((newEmployee) => {

    //                 // Update the employees with the new product
    //                 this._employeesdata.next([newEmployee, ...employees]);

    //                 // Return the new employee
    //                 return newEmployee;
    //             })
    //         ))
    //     );
    // }

    /**
     * Update employee
     *
     * @param id
     * @param product
     */
    // updateEmployee(id: string, product: Employee): Observable<Employee> {
    //     return this.employeedata$.pipe(
    //         take(1),
    //         switchMap(employees => this._httpClient.patch<Employee>('api/apps/employee/product', {
    //             id,
    //             product
    //         }).pipe(
    //             map((updatedEmployee) => {

    //                 // Find the index of the updated employee
    //                 const index = employees.findIndex(item => item.id === id);

    //                 // Update the employee
    //                 employees[index] = updatedEmployee;

    //                 // Update the employees
    //                 this._employeesdata.next(employees);

    //                 // Return the updated employee
    //                 return updatedEmployee;
    //             }),
    //             switchMap(updatedEmployee => this.employee$.pipe(
    //                 take(1),
    //                 filter(item => item && item.id === id),
    //                 tap(() => {

    //                     // Update the employee if it's selected
    //                     this._employeedata.next(updatedEmployee);

    //                     // Return the updated employee
    //                     return updatedEmployee;
    //                 })
    //             ))
    //         ))
    //     );
    // }

    /**
     * Delete the employee
     *
     * @param id
     */
    // deleteEmployee(id: string): Observable<boolean> {
    //     return this.employeedata$.pipe(
    //         take(1),
    //         switchMap(employees => this._httpClient.delete('api/apps/employee/product', { params: { id } }).pipe(
    //             map((isDeleted: boolean) => {

    //                 // Find the index of the deleted employee
    //                 const index = employees.findIndex(item => item.id === id);

    //                 // Delete the employee
    //                 employees.splice(index, 1);

    //                 // Update the employees
    //                 this._employeesdata.next(employees);

    //                 // Return the deleted status
    //                 return isDeleted;
    //             })
    //         ))
    //     );
    // }



}
