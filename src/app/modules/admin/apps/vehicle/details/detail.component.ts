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
  
      thumbnail: [""],
      images: [[]],
      currentImageIndex: [0], // Image index that is currently being viewed
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
