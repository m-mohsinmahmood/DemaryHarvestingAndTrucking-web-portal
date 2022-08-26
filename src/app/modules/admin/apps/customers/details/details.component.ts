import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from "@angular/router";
import { CustomersService } from '../customers.service';
import { AddFarmsComponent } from './add-farms/add-farms.component';
import { AddCropsComponent } from './add-crops/add-crops.component';
import { HarvestInfoComponent } from './harvest-info/harvest-info.component';


@Component({
    selector       : 'customer-details',
    templateUrl    : './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID
    customers:any;
    routes =  [
        {
            id: 2,
            title: 'Name & Description',
            icon: 'mat_outline:edit_note',
        },
        {
            id: 3,
            title: 'Physics & Shipping',
            icon: 'mat_outline:local_shipping',
        },
        {
            id: 4,
            title: 'Net Cost',
            icon: 'mat_outline:price_change'
        },
        {
            id: 5,
            title: 'Imprints',
            icon: 'mat_outline:checklist',
        },
        {
            id: 6,
            title: 'Colors',
            icon: 'mat_outline:color_lens',
        },
        {
            id: 24,
            title: 'Promostandard colors',
            icon: 'mat_outline:color_lens',
        },
        {
            id: 7,
            title: 'Sizes',
            icon: 'heroicons_outline:arrows-expand',
        },
        {
            id: 8,
            title: 'Features',
            icon: 'mat_outline:checklist'
        },
        {
            id: 9,
            title: 'Pack & Accessories',
            icon: 'feather:package',
        },
        {
            id: 10,
            title: 'Default Images',
            icon: 'mat_outline:image',
        },
        {
            id: 11,
            title: 'Default Margins',
            icon: 'mat_outline:margin',
        },
        {
            id: 12,
            title: 'Video',
            icon: 'mat_outline:play_circle_filled',
        },
        {
            id: 13,
            title: 'Swatches',
            icon: 'mat_outline:image',
        },
        {
            id: 14,
            title: 'Artwork Template',
            icon: 'heroicons_outline:template',
        },
        {
            id: 15,
            title: 'Product Reviews',
            icon: 'mat_outline:reviews',
        },
        {
            id: 16,
            title: 'Dietary Information',
            icon: 'mat_outline:info',
        },
        {
            id: 17,
            title: 'Licensing Terms',
            icon: 'mat_outline:picture_in_picture',
        },
        {
            id: 18,
            title: 'Warehouse Options',
            icon: 'mat_outline:house_siding',
        },
        {
            id: 1,
            title: 'Store Versions',
            icon: 'mat_outline:sd_storage'
        },
        {
            id: 19,
            title: 'Update History',
            icon: 'mat_outline:history',
        },
        {
            id: 20,
            title: 'Order History',
            icon: 'mat_outline:history',
        },
        {
            id: 21,
            title: 'Internal Notes',
            icon: 'mat_outline:speaker_notes',
        },
        {
            id: 22,
            title: 'Core Products',
            icon: 'mat_outline:group_work',
        },
        {
            id: 23,
            title: 'Duplicate',
            icon: 'heroicons_outline:duplicate'
        }
    ];

    // Sidebar stuff
      drawerMode: 'over' | 'side' = 'side';
      drawerOpened: boolean = true;
      selectedIndex: string = "Name & Description";


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _customerService: CustomersService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,


    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
          console.log("PARAMS:", params); //log the entire params object
          this.routeID = params.Id;
          console.log("object", this.routeID);
          console.log(params['id']) //log the value of id
        });


        // Get the employee by id
        this._customerService.getProductById(this.routeID).subscribe((customer) => {
            this.customers = customer
        });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(({ matchingAliases }) => {

      // Set the drawerMode and drawerOpened if the given breakpoint is active
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      }
      else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
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
    openUpdateDialog(): void
    {
    //Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent,{
         data:{id: this.routeID}
        });


        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
      });
    }
    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
      };


    backHandler(): void
    {
        this._router.navigate(["/apps/customers/"])
    }

    openAddFarmDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddFarmsComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }

    openAddCropDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddCropsComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }

    openHarvestInfoDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(HarvestInfoComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }


}
