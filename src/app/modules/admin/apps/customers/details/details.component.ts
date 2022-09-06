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
    routes = [];

    // Sidebar stuff
      drawerMode: 'over' | 'side' = 'side';
      drawerOpened: boolean = true;
      selectedIndex: string = "Contact Data";


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


        this.routes = this._customerService.navigationLabels;

        this.activatedRoute.params.subscribe((params) => {
          console.log("PARAMS:", params); //log the entire params object
          this.routeID = params.Id;
          console.log("object", this.routeID);
          console.log(params['id']) //log the value of id
        });


        // Get the employee by id
        this._customerService.getProductById(this.routeID).subscribe((customer) => {
            this.customers = customer;
            // if(this.customers.customerType == "Commercial Trucking")
            // {

            //   if(this.routes.find((x)=> x.title = "Farm Data"))
            //   {
            //     this.routes.splice(1, 1);
            //   }

            // }
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
    clicked(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
          return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
      };



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
