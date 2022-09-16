import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { brands as brandsData, categories as categoriesData, products as productsData, tags as tagsData, vendors as vendorsData, analytics as analyticsData, documents as documentsData } from 'app/mock-api/apps/customers/data';

@Injectable({
    providedIn: 'root'
})
export class CustomersInventoryMockApi
{
    private _categories: any[] = categoriesData;
    private _brands: any[] = brandsData;
    private _products: any[] = productsData;
    private _tags: any[] = tagsData;
    private _vendors: any[] = vendorsData;
    private _analytics: any = analyticsData;
    private _documents: any[] = documentsData;


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

        // Analytics Customer
        this._fuseMockApiService
        .onGet('api/customers/analytics')
        .reply(() => [200, cloneDeep(this._analytics)]);
        // -----------------------------------------------------------------------------------------------------
        // @ Categories - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/categories')
            .reply(() => [200, cloneDeep(this._categories)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Brands - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/brands')
            .reply(() => [200, cloneDeep(this._brands)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Products - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/products', 300)
            .reply(({request}) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the products
                let products: any[] | null = cloneDeep(this._products);

                // Sort the products
                if ( sort === 'sku' || sort === 'name' || sort === 'active' )
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
                    // Filter the products
                    products = products.filter(contact => contact.name && contact.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const productsLength = products.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), productsLength);
                const lastPage = Math.max(Math.ceil(productsLength / size), 1);

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
                        length    : productsLength,
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
        // @ Product - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/product')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the products
                const products = cloneDeep(this._products);

                // Find the product
                const product = products.find(item => item.id === id);

                // Return the response
                return [200, product];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/customers/product')
            .reply(() => {

                // Generate a new product
                const newProduct = {
                    id         : FuseMockApiUtils.guid(),
                    harvestYear   : '',
                    name       : '',
                    alternateName: '',
                    tags       : [],
                    skipInvoiceMath1        : '',
                    arizonaInvoiceMath    : '',
                    skipInvoiceMath2      : '',
                    isActive     : '',
                    email      : '',
                    stateProvince : '',
                    farmId:  '',
                    farmHarvestYear:  '',
                    farmName:  '',
                    farmTotalAcres:  '',
                    cropid:  '',
                    cropHarvestYear:  '',
                    cropCrop:  '',
                    cropPoundsPerBushel:  '',
                    images     : [],
                    active     : false,
                    contactNo:'',
                    phoneNo: '',
                    position:'',
                    
                };

                // Unshift the new product
                this._products.unshift(newProduct);

                // Return the response
                return [200, newProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/customers/product')
            .reply(({request}) => {

                // Get the id and product
                const id = request.body.id;
                const product = cloneDeep(request.body.product);

                // Prepare the updated product
                let updatedProduct = null;

                // Find the product and update it
                this._products.forEach((item, index, products) => {

                    if ( item.id === id )
                    {
                        // Update the product
                        products[index] = assign({}, products[index], product);

                        // Store the updated product
                        updatedProduct = products[index];
                    }
                });

                // Return the response
                return [200, updatedProduct];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Product - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/customers/product')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the product and delete it
                this._products.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._products.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/tags')
            .reply(() => [200, cloneDeep(this._tags)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/customers/tag')
            .reply(({request}) => {

                // Get the tag
                const newTag = cloneDeep(request.body.tag);

                // Generate a new GUID
                newTag.id = FuseMockApiUtils.guid();

                // Unshift the new tag
                this._tags.unshift(newTag);

                // Return the response
                return [200, newTag];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/customers/tag')
            .reply(({request}) => {

                // Get the id and tag
                const id = request.body.id;
                const tag = cloneDeep(request.body.tag);

                // Prepare the updated tag
                let updatedTag = null;

                // Find the tag and update it
                this._tags.forEach((item, index, tags) => {

                    if ( item.id === id )
                    {
                        // Update the tag
                        tags[index] = assign({}, tags[index], tag);

                        // Store the updated tag
                        updatedTag = tags[index];
                    }
                });

                // Return the response
                return [200, updatedTag];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tag - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/customers/tag')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the tag and delete it
                this._tags.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._tags.splice(index, 1);
                    }
                });

                // Get the products that have the tag
                const productsWithTag = this._products.filter(product => product.tags.indexOf(id) > -1);

                // Iterate through them and delete the tag
                productsWithTag.forEach((product) => {
                    product.tags.splice(product.tags.indexOf(id), 1);
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Vendors - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/customers/vendors')
            .reply(() => [200, cloneDeep(this._vendors)]);

            // -----------------------------------------------------------------------------------------------------
        // @ Items - GET
        // -----------------------------------------------------------------------------------------------------

        this._fuseMockApiService
        .onGet('api/apps/customers/details')
        .reply(({request}) => {
           console.log('customer mockapi2');
            // Clone the items
            let items = cloneDeep(this._documents);
            const itemss = cloneDeep(this._documents);

            // See if a folder id exist
            const folderId = request.params.get('folderId') ?? null;
            console.log('FolderId:',folderId);

            // Filter the items by folder id. If folder id is null,
            // that means we want to root items which have folder id
            // of null
            items = items.filter(item => item.folderId === folderId);
            console.log('Items:',items);
            console.log('Itemss:',itemss);
            //  const filess: any = {};
            // if(folderId){
            //      filess = items.filter(item => item.type !== 'folder');
            // }
            // Separate the items by folders and files
            const folders = itemss.filter(item => item.type === 'folder');
            console.log('Folders:',folders);
            // const folderss = itemss.filter(item => item.type === 'folder');
            const files = items.filter(item => item.type !== 'folder');

            // Sort the folders and files alphabetically by filename
            // folders.sort((a, b) => a.name.localeCompare(b.name));
            folders.sort((a, b) => a.name.localeCompare(b.name));
            files.sort((a, b) => a.name.localeCompare(b.name));

            // Figure out the path and attach it to the response
            // Prepare the empty paths array
            const pathItems = cloneDeep(this._documents);
            const path = [];

            // Prepare the current folder
            // let currentFolder = null;

            // Get the current folder and add it as the first entry
            // if ( folderId )
            // {
            //     currentFolder = pathItems.find(item => item.id === folderId);
            //     path.push(currentFolder);
            // }

            // Start traversing and storing the folders as a path array
            // until we hit null on the folder id
            // while ( currentFolder?.folderId )
            // {
            //     currentFolder = pathItems.find(item => item.id === currentFolder.folderId);
            //     if ( currentFolder )
            //     {
            //         path.unshift(currentFolder);
            //     }
            // }

            return [
                200,
                {
                    folders,
                    files,
                    path
                }
            ];
        });
    }
}
