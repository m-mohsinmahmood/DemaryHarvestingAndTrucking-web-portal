import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { VehicleService } from "../vehicle.service";
import {
  VehicleBrand,
  VehicleCategory,
  VehiclePagination,
  VehicleProduct,
  VehicleTag,
  VehicleVendor,
} from "app/modules/admin/apps/vehicle/vehicle.types";
import {
  debounceTime,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { assign } from 'lodash-es';
import { categories } from './../../../../../mock-api/apps/ecommerce/inventory/data';

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  // styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  products$: Observable<VehicleProduct[]>;

  brands: VehicleBrand[];
   categories: VehicleCategory[];
  // categories:any;
  filteredTags: VehicleTag[];
  flashMessage: "success" | "error" | null = null;
  isLoading: boolean = false;
  pagination: VehiclePagination;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: VehicleProduct | null = null;
  selectedProductForm: FormGroup;
  tags: VehicleTag[];
  tagsEditMode: boolean = false;
  vendors: VehicleVendor[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID; // URL ID
  selected = 'Cartwheel';


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _inventoryService: VehicleService,
    private _matDialog: MatDialog,
    public _router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log("PARAMS:", params); //log the entire params object
      this.routeID = params.id;
      console.log("object", this.routeID);
      // console.log(params['id']) //log the value of id
    });

    // Create the selected product form
    this.selectedProductForm = this._formBuilder.group({
      // id: [""],
      // category: [""],
      // name: ["", [Validators.required]],
      // description: [""],
      // tags: [[]],
      // sku: [""],
      // barcode: [""],
      // brand: [""],
      // vendor: [""],
      // stock: [""],
      // reserved: [""],
      // cost: [""],
      // basePrice: [""],
      // taxPercent: [""],
      // price: [""],
      // weight: [""],
      thumbnail: [""],
      images: [[]],
      currentImageIndex: [0], // Image index that is currently being viewed
      // active: [false],


      vehicleName:[""],
      id: [""],
      type:[[]],
     condition:[[]],
     companyName:[""],
     assigneName:[""],
     assignDate:[""],
     fuelStart:[""],
     fuelEnd:[""],
     status:[""],
    //  typeValue:[[]]
    });

    // Get the brands
    // this._inventoryService.brands$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((brands: VehicleBrand[]) => {
    //     /* console.log("ddd") */
    //     // Update the brands
    //     this.brands = brands;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Get the categories
    // this._inventoryService.categories$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((categories: VehicleCategory[]) => {
    //     /* console.log("www") */
    //     // Update the categories
    //     this.categories = categories;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Get the pagination
    // this._inventoryService.pagination$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((pagination: VehiclePagination) => {
    //     // Update the pagination
    //     this.pagination = pagination;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Get the products
    // this.products$ = this._inventoryService.products$;

    // Get the tags
    // this._inventoryService.tags$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((tags: VehicleTag[]) => {
    //     // Update the tags
    //     this.tags = tags;
    //     this.filteredTags = tags;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Get the vendors
    // this._inventoryService.vendors$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((vendors: VehicleVendor[]) => {
    //     // Update the vendors
    //     this.vendors = vendors;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });

    // Subscribe to search input field value changes
    // this.searchInputControl.valueChanges
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     debounceTime(300),
    //     switchMap((query) => {
    //       this.closeDetails();
    //       this.isLoading = true;
    //       return this._inventoryService.getProducts(
    //         0,
    //         10,
    //         "name",
    //         "asc",
    //         query
    //       );
    //     }),
    //     map(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe();
    
     // If the product is already selected...
        // if ( this.selectedProduct && this.selectedProduct.id === productId )
        // {
        //     // Close the details
        //     this.closeDetails();
        //     return;
        // }

    // Get the product by id
    this._inventoryService.getProductById(this.routeID).subscribe((product) => {
      // Set the selected product
      this.selectedProduct = product;
        console.log("ID CALLED", product)
      // Fill the form
      this.selectedProductForm.patchValue(product);
        console.log("ID CALLED",   this.selectedProductForm)
      // Mark for check
      this._changeDetectorRef.markForCheck();
      //   console.log("ID CALLED")
    });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedProduct = null;
  }

  /**
   * Filter tags
   *
   * @param event
   */
  // filterTags(event): void {
  //   // Get the value
  //   const value = event.target.value.toLowerCase();

  //   // Filter the tags
  //   this.filteredTags = this.tags.filter((tag) =>
  //     tag.title.toLowerCase().includes(value)
  //   );
  // }

  /**
   * Filter tags input key down event
   *
   * @param event
   */
  // filterTagsInputKeyDown(event): void {
  //   // Return if the pressed key is not 'Enter'
  //   if (event.key !== "Enter") {
  //     return;
  //   }

  //   // If there is no tag available...
  //   if (this.filteredTags.length === 0) {
  //     // Create the tag
  //     this.createTag(event.target.value);

  //     // Clear the input
  //     event.target.value = "";

  //     // Return
  //     return;
  //   }

  //   // If there is a tag...
  //   const tag = this.filteredTags[0];
  //   const isTagApplied = this.selectedProduct.tags.find((id) => id === tag.id);

  //   // If the found tag is already applied to the product...
  //   if (isTagApplied) {
  //     // Remove the tag from the product
  //     this.removeTagFromProduct(tag);
  //   } else {
  //     // Otherwise add the tag to the product
  //     this.addTagToProduct(tag);
  //   }
  // }

  /**
   * Create a new tag
   *
   * @param title
   */
  // createTag(title: string): void {
  //   const tag = {
  //     title,
  //   };

  //   // Create tag on the server
  //   this._inventoryService.createTag(tag).subscribe((response) => {
  //     // Add the tag to the product
  //     this.addTagToProduct(response);
  //   });
  // }

  /**
   * Add tag to the product
   *
   * @param tag
   */
  // addTagToProduct(tag: VehicleTag): void {
  //   // Add the tag
  //   this.selectedProduct.tags.unshift(tag.id);

  //   // Update the selected product form
  //   this.selectedProductForm.get("tags").patchValue(this.selectedProduct.tags);

  //   // Mark for check
  //   this._changeDetectorRef.markForCheck();
  // }

  /**
   * Update the tag title
   *
   * @param tag
   * @param event
   */
  // updateTagTitle(tag: VehicleTag, event): void {
  //   // Update the title on the tag
  //   tag.title = event.target.value;

  //   // Update the tag on the server
  //   this._inventoryService
  //     .updateTag(tag.id, tag)
  //     .pipe(debounceTime(300))
  //     .subscribe();

  //   // Mark for check
  //   this._changeDetectorRef.markForCheck();
  // }

  /**
   * Delete the tag
   *
   * @param tag
   */
  // deleteTag(tag: VehicleTag): void {
  //   // Delete the tag from the server
  //   this._inventoryService.deleteTag(tag.id).subscribe();

  //   // Mark for check
  //   this._changeDetectorRef.markForCheck();
  // }

  /**
   * Toggle product tag
   *
   * @param tag
   * @param change
   */
  // toggleProductTag(tag: VehicleTag, change: MatCheckboxChange): void {
  //   if (change.checked) {
  //     this.addTagToProduct(tag);
  //   } else {
  //     this.removeTagFromProduct(tag);
  //   }
  // }

  /**
   * Remove tag from the product
   *
   * @param tag
   */
  // removeTagFromProduct(tag: VehicleTag): void {
  //   // Remove the tag
  //   this.selectedProduct.tags.splice(
  //     this.selectedProduct.tags.findIndex((item) => item === tag.id),
  //     1
  //   );

  //   // Update the selected product form
  //   this.selectedProductForm.get("tags").patchValue(this.selectedProduct.tags);

  //   // Mark for check
  //   this._changeDetectorRef.markForCheck();
  // }

  /**
   * Toggle the tags edit mode
   */
  // toggleTagsEditMode(): void {
  //   this.tagsEditMode = !this.tagsEditMode;
  // }

  /**
   * Should the create tag button be visible
   *
   * @param inputValue
   */
  // shouldShowCreateTagButton(inputValue: string): boolean {
  //   return !!!(
  //     inputValue === "" ||
  //     this.tags.findIndex(
  //       (tag) => tag.title.toLowerCase() === inputValue.toLowerCase()
  //     ) > -1
  //   );
  // }

  /**
   * Delete the selected product using the form data
   */
  deleteSelectedProduct(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete product",
      message:
        "Are you sure you want to remove this product? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Delete the product on the server
        this._inventoryService.deleteProduct(product.id).subscribe(() => {
          // Close the details
          this.closeDetails();
        });
      }
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
    this._inventoryService.updateProduct(product.id, product).subscribe(() => {
      // Show a success message
      this.showFlashMessage("success");

      // Navigate to Vehivle Page
      this._router.navigate(["/apps/vehicle"]);
    });
  }

  /**
   * Cancel the selected product using the form data
   */
  backToPage(): void {
    this._router.navigate(["/apps/vehicle"]);
  }

  /**
   * Show flash message
   */
  showFlashMessage(type: "success" | "error"): void {
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
}
