import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    Subscription,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    InventoryBrand,
    InventoryCategory,
    InventoryPagination,
    InventoryProduct,
    InventoryTag,
    InventoryVendor,
} from 'app/modules/admin/apps/equipment/machinery/machinery.types';
import { MachineryService } from 'app/modules/admin/apps/equipment/machinery/machinery.service';
import { Router } from '@angular/router';
import { UpdateAddMachineryComponent } from '../update/update-add.component';
import { Machineries } from '../../motorized/motorized.types';

@Component({
    selector: 'machinery-list',
    templateUrl: './machinery.component.html',
    styleUrls: ['./machinery.component.scss'],

    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class MachineryListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;

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
    isEdit: boolean = false;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    sort: any;
    order: any;
    limit: number;

    //#region Observables
    search: Subscription;
    machinery$: Observable<Machineries>;
    isLoadingMachinery$: Observable<boolean>;
    machineries$: Observable<Machineries[]>;
    isLoadingMachineries$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _machineryService: MachineryService,
        private _matDialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.initApis();
        this.initObservables();

        // // Create the selected product form
        // this.selectedProductForm = this._formBuilder.group({
        //     id: [''],
        //     category: [''],
        //     name: ['', [Validators.required]],
        //     description: [''],
        //     tags: [[]],
        //     sku: [''],
        //     barcode: [''],
        //     brand: [''],
        //     vendor: [''],
        //     stock: [''],
        //     reserved: [''],
        //     cost: [''],
        //     basePrice: [''],
        //     taxPercent: [''],
        //     price: [''],
        //     weight: [''],
        //     thumbnail: [''],
        //     images: [[]],
        //     currentImageIndex: [0], // Image index that is currently being viewed
        //     active: [false],
        // });

        // // Get the brands
        // this._machineryService.brands$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((brands: InventoryBrand[]) => {
        //         // Update the brands
        //         this.brands = brands;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Get the categories
        // this._machineryService.categories$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((categories: InventoryCategory[]) => {
        //         // Update the categories
        //         this.categories = categories;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Get the pagination
        // this._machineryService.pagination$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((pagination: InventoryPagination) => {
        //         // Update the pagination
        //         this.pagination = pagination;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Get the products
        // this.products$ = this._machineryService.products$;

        // // Get the tags
        // this._machineryService.tags$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((tags: InventoryTag[]) => {
        //         // Update the tags
        //         this.tags = tags;
        //         this.filteredTags = tags;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Get the vendors
        // this._machineryService.vendors$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((vendors: InventoryVendor[]) => {
        //         // Update the vendors
        //         this.vendors = vendors;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Subscribe to search input field value changes
        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         switchMap((query) => {
        //             this.closeDetails();
        //             this.isLoading = true;
        //             return this._machineryService.getProducts(
        //                 0,
        //                 10,
        //                 'name',
        //                 'asc',
        //                 query
        //             );
        //         }),
        //         map(() => {
        //             this.isLoading = false;
        //         })
        //     )
        //     .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#region Init Observables and Apis
    initObservables() {
        this.isLoadingMachinery$ = this._machineryService.isLoadingMachinery$;
        this.isLoadingMachineries$ = this._machineryService.isLoadingMachineries$;
        this.machineries$ = this._machineryService.machineries$;
        this.machinery$ = this._machineryService.machinery$;
        // this.search = this.searchform.valueChanges
        //     .pipe(
        //         debounceTime(500),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe((data) => {
        //         this.searchResult = data.search;
        //         this.page = 1;
        //         this._machineryService.getCustomers(
        //             1,
        //             10,
        //             '',
        //             '',
        //             this.searchResult,
        //             this.customerFiltersForm.value
        //         );
        //     });
    }

    initApis() {
        this._machineryService.getMachineries();
    }

    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle employee details
     *
     * @param machineId
     */
    toggleDetails(machineId: string): void {
        this._router.navigate([
            `/apps/equipment/machinery/details/${machineId}`,
        ]);
    }
    openAddDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateAddMachineryComponent);
        /* const dialogRef = this._matDialog.open(UpdateComponent,{
         data:{id: '7eb7c859-1347-4317-96b6-9476a7e2784578ba3c334343'}
        }); */

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex =
            this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedProductForm
                .get('currentImageIndex')
                .setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedProductForm
                .get('currentImageIndex')
                .setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter((tag) =>
            tag.title.toLowerCase().includes(value)
        );
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void {
        const tag = {
            title,
        };

        // Create tag on the server
        this._machineryService.createTag(tag).subscribe((response) => {
            // Add the tag to the product
            this.addTagToProduct(response);
        });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: InventoryTag, event): void {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._machineryService
            .updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: InventoryTag): void {
        // Delete the tag from the server
        this._machineryService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag: InventoryTag): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag: InventoryTag): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void {
        if (change.checked) {
            this.addTagToProduct(tag);
        } else {
            this.removeTagFromProduct(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Create product
     */
    createProduct(): void {
        // Create the product
        this._machineryService.createProduct().subscribe((newProduct) => {
            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            this.selectedProductForm.patchValue(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        this._machineryService
            .updateProduct(product.id, product)
            .subscribe(() => {
                // Show a success message
                this.showFlashMessage('success');
            });
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedProduct(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to remove this product? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._machineryService
                    .deleteProduct(product.id)
                    .subscribe(() => {
                        // Close the details
                        this.closeDetails();
                    });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
