/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    APP_INITIALIZER,
} from '@angular/core';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateComponent } from '../update/update.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../customers.service';
import { AddFarmsComponent } from './add-farms/add-farms.component';
import { AddCropsComponent } from './add-crops/add-crops.component';
import { HarvestInfoComponent } from './harvest-info/harvest-info.component';
import { CustomerContacts } from '../customers.types';

@Component({
    selector: 'customer-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    search: Subscription;
    customerContact$: Observable<CustomerContacts>;
    isLoadingCustomerContact$: Observable<boolean>;
    customerContacts$: Observable<CustomerContacts[]>;
    isLoadingCustomerContacts$: Observable<boolean>;
    exportCustomerContacts$: Observable<CustomerContacts>;

    customerDestination$: Observable<any>;
    customerCrops$: Observable<any>;

    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;

    isLoading: boolean = false;
    routeID; // URL ID
    customers: any;
    routes = [];
    folderId: any;

    // Sidebar stuff
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = 'Farm Data';

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
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.routes = this._customerService.navigationLabels;
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
        this.initApis(this.routeID);
        this.initObservables();
    }

    initObservables() {
        this.isLoadingCustomerContacts$ =
            this._customerService.isLoadingCustomerContacts$;
        this.isLoadingCustomerContact$ =
        this._customerService.isLoadingCustomerContact$;
        this.customerContacts$ = this._customerService.customerContacts$;
        console.log('Customer Contact', this.customerContacts$);

        this.customerContact$ = this._customerService.customerContact$;

        // Customer Destination
        this.customerDestination$ = this._customerService.customerDestination$;
        console.log('Customer Destination', this.customerDestination$);

        // // Customer Crops
        // this.customerCrops$ = this._customerService.customerCrops$;
        // console.log('Customer Crops', this.customerCrops$);

        // this.search = this.searchform.valueChanges
        //     .pipe(debounceTime(500))
        //     .subscribe((data) => {
        //         this.searchResult = data.search;
        //         this._customerService.getCustomers(
        //             1,
        //             10,
        //             '',
        //             '',
        //             this.searchResult
        //         );
        //     });
    }

    initApis(id: string) {
        this._customerService.getCustomerContact(id);
        this._customerService.getCustomerDestination(id);
        this._customerService.getCustomerCrops(id);
    }

    // // Get the employee by id
    // this._customerService.getCustomerById(this.routeID)
    // // .subscribe((customer) => {
    // //     this.customers = customer;
    // //     // if(this.customers.customerType == "Commercial Trucking")
    // //     // {

    // //     //   if(this.routes.find((x)=> x.title = "Farm Data"))
    // //     //   {
    // //     //     this.routes.splice(1, 1);
    // //     //   }

    // //     // }
    // // });

    // Subscribe to media changes
    // this._fuseMediaWatcherService.onMediaChange$
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(({ matchingAliases }) => {

    //   // Set the drawerMode and drawerOpened if the given breakpoint is active
    //   if (matchingAliases.includes('lg')) {
    //     this.drawerMode = 'side';
    //     this.drawerOpened = true;
    //   }
    //   else {
    //     this.drawerMode = 'over';
    //     this.drawerOpened = false;
    //   }

    //   // Mark for check
    //   this._changeDetectorRef.markForCheck();
    // });

    // this._customerService.getItems2().subscribe((i) => {
    //     // console.log('All items', i.folders[0].folderId);
    //     this.folderId = i.folders[0].folderId;

    // });
    // this._customerService.items$.subscribe((c)=>{
    //     console.log('All Document data', c);
    //     this._customerService.getItems2(c.folders[0].folderId).subscribe((b) => {
    //         console.log('Filtered', b);
    //     });
    // });

    // for first document
    // this._customerService.getItems2(a).subscribe((b) => {
    //     console.log('Filtered', b);
    // });

    /**
     * On destroy
     */
    ngOnDestroy(): void {
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
    }

    openUpdateDialog(): void {
        //Open the dialog
        const dialogRef = this._matDialog.open(UpdateComponent, {
            data: { id: this.routeID },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    }

    backHandler(): void {
        this._router.navigate(['/apps/customers/']);
    }

    openAddFarmDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddFarmsComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openAddCropDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddCropsComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openHarvestInfoDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(HarvestInfoComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
