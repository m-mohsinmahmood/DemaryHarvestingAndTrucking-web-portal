import { routes } from './../../../ui/cards/cards.module';
import { AfterViewInit } from '@angular/core';
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

@Component({
    selector: 'customer-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Customer Observables
    customer$: Observable<any>;
    isLoadingCustomer$: Observable<any>;

    search: Subscription;
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
    selectedIndex: string = 'Customer General Information';

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

    //#region Life Cycle Functions
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
    }

    ngAfterViewInit(): void {
        this.initApis(this.routeID);
        this.initObservables();
        this.initSideNavigation();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion
    //#region Initialize Observables
    initObservables() {
        // Data
        this.customer$ = this._customerService.customer$;
        // Loader
        this.isLoadingCustomer$ = this._customerService.isLoadingCustomer$;
    }
    //#endregion
    //#region Initial APIs
    initApis(id: string) {
        this._customerService.getCustomerById(id);
    }
    //#endregion
    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._customerService.navigationLabels;
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
    }

    //#endregion
    
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
}
