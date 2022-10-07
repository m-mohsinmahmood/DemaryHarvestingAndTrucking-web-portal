import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsDataComponent } from './contacts-data/contacts-data.component';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/customers/customers.types';
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCustomerContact } from './add/add.component';

@Component({
    selector       : 'customers-contacts',
    templateUrl    : './customers-contacts.component.html',
    styles         : [
        /* language=SCSS */
        `
            .contact-grid {
                grid-template-columns: 60% 40%;

                @screen sm {
                    grid-template-columns: 15% 15% 15% 15% 15% 15%;
                }
                @screen md {
                    grid-template-columns:  15% 15% 15% 15% 15% 15%;
                }

                @screen lg {
                    grid-template-columns:  15% 15% 15% 15% 15% 15% 10%;
                }
            }
            .redInActiveIcon
            {
                color:#dc2626;
            }
            .greenActiveIcon
            {
                color:#16a34a;
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class CustomersContactsList implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    products$: Observable<InventoryProduct[]>;
    customers: any;
    routeID;
    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isContactData: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _customersService: CustomersService,
        private _matDialog: MatDialog,
        private _router: Router,
        public activatedRoute: ActivatedRoute,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected product form
        this.selectedProductForm = this._formBuilder.group({
            id               : [''],
            harvestYear      : [''],
            name             : ['', [Validators.required]],
            alternateName      : [''],
            skipInvoiceMath1              : [''],
            arizonaInvoiceMath          : [''],
            skipInvoiceMath2            : [''],
            avatar: [''],
            email            : [''],
            stateProvince    : [''],
            isActive         : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false],
            farmId: [''],
            farmHarvestYear: [''],
            farmName: [''],
            farmTotalAcres: [''],
            cropid: [''],
            cropHarvestYear: [''],
            cropCrop: [''],
            cropPoundsPerBushel: [''],
            contactNo: [''],
            customerType:[''],
            phoneNo: [''],
            position:[''],
            fname:[''],
            lName:[''],


        });

        this.activatedRoute.params.subscribe((params) => {
            console.log('PARAMSS:', params);
            this.routeID = params.Id;
            console.log('object', this.routeID);
            console.log(params['id']); //log the value of id

          });

          this._customersService.getCustomerById(this.routeID);
          /* .subscribe((customer) => {

              this.customers = customer;

              console.log("FFF",customer);
          }); */

    }

    openAddDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddCustomerContact);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param productId
     */
     toggleDetails(productId: string): void
    {
        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        }
        // Get the product by id
        this._customersService.getCustomerById(productId);
            /* .subscribe((product) => {
                this._router.navigateByUrl('apps/customers/details/'+ productId)
                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }); */
    }
    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }


     /**
     * Toggle Customer Contacts
     *
     * @param productId
     */
      toggleContactsDetails(productId: string): void
      {
          /* // If the product is already selected...
          if ( this.selectedProduct && this.selectedProduct.id === productId )
          {
              // Close the details
              this.closeDetails();
              return;
          }
          // Get the product by id
          this._customersService.getProductById(productId)
              .subscribe((product) => {
                  this._router.navigateByUrl('apps/customers/contacts-data/'+ productId)
                  // Set the selected product
                  this.selectedProduct = product;

                  // Fill the form
                  this.selectedProductForm.patchValue(product);

                  // Mark for check
                  this._changeDetectorRef.markForCheck();
              }); */

              /* this.isContactData = true; */
              // Open the dialog
        const dialogRef = this._matDialog.open(ContactsDataComponent,{
          width: '1200px',
        });


        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
      });
      }

      toggleCustomerContacts() {
        this.isContactData = false;
      }
      /**
       * Close the details
       */
      closeContactsDetails(): void
      {
          this.selectedProduct = null;
      }

    /**
     * Cycle through images of selected product
     */







    /**
     * Create a new tag
     *
     * @param title
     */

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */








    createProduct(data:any): void
    {
        // Create the product
        this._customersService.createCustomer(data);
        /* subscribe((newProduct) => {

            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            this.selectedProductForm.patchValue(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }); */
    }



    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
