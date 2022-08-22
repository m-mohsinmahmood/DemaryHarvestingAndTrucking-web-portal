import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { applicants as applicantsData} from 'app/mock-api/apps/applicants/data';

@Injectable({
    providedIn: 'root'
})
export class ApplicantMockApi
{
    private _applicants: any[] = applicantsData;


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
        // @ Applicants - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/applicants', 300)
            .reply(({request}) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the applicants
                let products: any[] | null = cloneDeep(this._applicants);

                // Sort the products
                if ( sort === 'country' || sort === 'namee' || sort === 'phone' )
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
                    // Filter the applicants
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
        // @ Applicant - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/applicants/product')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the applicant
                const applicants = cloneDeep(this._applicants);

                // Find the applicant
                const applicant = applicants.find(item => item.id === id);

                // Return the response
                return [200, applicant];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Applicant - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/applicants/product')
            .reply(() => {

                // Generate a new applicant
                const newApplicant = {
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

                // Unshift the new appliccant
                this._applicants.unshift(newApplicant);

                // Return the response
                return [200, newApplicant];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Applicant - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/applicants/product')
            .reply(({request}) => {
            console.log('Request:',request);

                // Get the id and applicant
                const id = request.body.id;
                const applicant = cloneDeep(request.body.applicant);

                // Prepare the updated applicant
                let updatedApplicant = null;

                // Find the applicant and update it
                this._applicants.forEach((item, index, applicants) => {

                    if ( item.id === id )
                    {
                        // Update the applicant
                        applicants[index] = assign({}, applicants[index], applicant);

                        // Store the updated applicant
                        updatedApplicant = applicants[index];
                    }
                });

                // Return the response
                return [200, updatedApplicant];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Applicant - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/applicants/product')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the employee and delete it
                this._applicants.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._applicants.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
