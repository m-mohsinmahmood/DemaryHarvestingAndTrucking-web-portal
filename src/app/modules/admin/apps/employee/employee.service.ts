import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { EmployeePagination, Employee } from 'app/modules/admin/apps/employee/employee.types';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService
{
    // Private
  
    private _pagination: BehaviorSubject<EmployeePagination | null> = new BehaviorSubject(null);
    private _employeedata: BehaviorSubject<Employee | null> = new BehaviorSubject(null);
    private _employeesdata: BehaviorSubject<Employee[] | null> = new BehaviorSubject(null);
    

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<EmployeePagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for employee
     */
    get employee$(): Observable<Employee>
    {
        return this._employeedata.asObservable();
    }

    /**
     * Getter for employees
     */
    get employeedata$(): Observable<Employee[]>
    {
        return this._employeesdata.asObservable();
    }  

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
        Observable<{ pagination: EmployeePagination; products: Employee[] }>
    {
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
    getEmployeeById(id: string): Observable<Employee>
    {
        console.log('ID::',id)
        return this._employeesdata.pipe(
            take(1),
            map((employees) => {
                console.log('first',employees)
                // Find the employee
                const employee = employees.find(item => item.id === id) || null;

                // Update the employee
                this._employeedata.next(employee);

                // Return the employee
                return employee;
            }),
            switchMap((employee) => {

                if ( !employee )
                {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(employee);
            })
        );
    }

    /**
     * Create product
     */
    createEmployee(): Observable<Employee>
    {
        return this.employeedata$.pipe(
            take(1),
            switchMap(employees => this._httpClient.post<Employee>('api/apps/employee/product', {}).pipe(
                map((newEmployee) => {

                    // Update the employees with the new product
                    this._employeesdata.next([newEmployee, ...employees]);

                    // Return the new employee
                    return newEmployee;
                })
            ))
        );
    }

    /**
     * Update employee
     *
     * @param id
     * @param product
     */
    updateEmployee(id: string, product: Employee): Observable<Employee>
    {
        return this.employeedata$.pipe(
            take(1),
            switchMap(employees => this._httpClient.patch<Employee>('api/apps/employee/product', {
                id,
                product
            }).pipe(
                map((updatedEmployee) => {

                    // Find the index of the updated employee
                    const index = employees.findIndex(item => item.id === id);

                    // Update the employee
                    employees[index] = updatedEmployee;

                    // Update the employees
                    this._employeesdata.next(employees);

                    // Return the updated employee
                    return updatedEmployee;
                }),
                switchMap(updatedEmployee => this.employee$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the employee if it's selected
                        this._employeedata.next(updatedEmployee);

                        // Return the updated employee
                        return updatedEmployee;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the employee
     *
     * @param id
     */
     deleteEmployee(id: string): Observable<boolean>
    {
        return this.employeedata$.pipe(
            take(1),
            switchMap(employees => this._httpClient.delete('api/apps/employee/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted employee
                    const index = employees.findIndex(item => item.id === id);

                    // Delete the employee
                    employees.splice(index, 1);

                    // Update the employees
                    this._employeesdata.next(employees);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    

    

   

    
}
