import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { employees as employeesData} from 'app/mock-api/apps/employee/data';

@Injectable({
    providedIn: 'root'
})
export class EmployeeMockApi
{
    private _employees: any[] = employeesData;
   

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        
        // -----------------------------------------------------------------------------------------------------
        // @ Employees - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/employee', 300)
            .reply(({request}) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the employees
                let products: any[] | null = cloneDeep(this._employees);

                // Sort the products
                if ( sort === 'role' || sort === 'namee' || sort === 'email' )
                {
                    products.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else
                {
                    products.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if ( search )
                {
                    // Filter the employees
                    products = products.filter(contact => contact.name && contact.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const employeeLength = products.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), employeeLength);
                const lastPage = Math.max(Math.ceil(employeeLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // products but also send the last possible page so
                // the app can navigate to there
                if ( page > lastPage )
                {
                    products = null;
                    pagination = {
                        lastPage
                    };
                }
                else
                {
                    // Paginate the results by size
                    products = products.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length    : employeeLength,
                        size      : size,
                        page      : page,
                        lastPage  : lastPage,
                        startIndex: begin,
                        endIndex  : end - 1
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        products,
                        pagination
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Employee - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/employee/product')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the employee
                const employees = cloneDeep(this._employees);

                // Find the employee
                const employee = employees.find(item => item.id === id);

                // Return the response
                return [200, employee];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Employee - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/employee/product')
            .reply(() => {

                // Generate a new employee
                const newEmployee = {
                    id         : FuseMockApiUtils.guid(),
                    category   : '',
                    name       : 'A New Product',
                    description: '',
                    tags       : [],
                    sku        : '',
                    barcode    : '',
                    brand      : '',
                    vendor     : '',
                    stock      : '',
                    reserved   : '',
                    cost       : '',
                    basePrice  : '',
                    taxPercent : '',
                    price      : '',
                    weight     : '',
                    thumbnail  : '',
                    images     : [],
                    active     : false
                };

                // Unshift the new employee
                this._employees.unshift(newEmployee);

                // Return the response
                return [200, newEmployee];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Employee - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/employee/product')
            .reply(({request}) => {

                // Get the id and employee
                const id = request.body.id;
                const product = cloneDeep(request.body.product);

                // Prepare the updated employee
                let updatedEmployee = null;

                // Find the employee and update it
                this._employees.forEach((item, index, employees) => {

                    if ( item.id === id )
                    {
                        // Update the employee
                        employees[index] = assign({}, employees[index], product);

                        // Store the updated employee
                        updatedEmployee = employees[index];
                    }
                });

                // Return the response
                return [200, updatedEmployee];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Employee - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/employee/product')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the employee and delete it
                this._employees.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._employees.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
