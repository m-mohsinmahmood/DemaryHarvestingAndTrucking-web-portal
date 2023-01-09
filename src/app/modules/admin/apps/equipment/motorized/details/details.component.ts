/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MotorizedService } from '../motorized.service';
import { EquipmentService } from '../../equipment.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UpdateAddMotorizedComponent } from '../update/update-add.component';




@Component({
    selector: 'motorized-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorizedDetailComponent implements OnInit, OnDestroy {

    //#region Variables

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    routeID; // URL ID
    vehicleDetails: any;

    routes = [];
    // Sidebar stuff
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = 'Profile';
    //#endregion

    //#region Observables
    motorizedVehicle$: Observable<any>;
    isLoadingMotorizedVehicle$: Observable<any>;
    isEdit: boolean;
    //#endregion




    /**
     * Constructor
     */
    constructor(

        public activatedRoute: ActivatedRoute,
        private _motorizedService: MotorizedService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService



    ) {
    }

    //#region Lifecycle Functions

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
        this.motorizedVehicle$ = this._motorizedService.motorizedVehicle$;
        // Loader
        this.isLoadingMotorizedVehicle$ = this._motorizedService.isLoadingMotorizedVehicle$;
    }
    //#endregion

    //#region Initial APIs
    initApis(id: string) {
        this._motorizedService.getMotorizedVehicleById(id);
    }
    //#endregion

    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._motorizedService.navigationLabels;
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

  //#region Update Dialog
  openUpdateDialog(event): void {
    this.isEdit = true;
    //Open the dialog
    const dialogRef = this._matDialog.open(UpdateAddMotorizedComponent, {
      data: {
        isEdit: this.isEdit,
        motorizedData: {
          id: event.id,
          type: event.type,
          status: event.status,
          name: event.name,
          odometer: event.odometer,
          odometer_reading: event.odometer_reading,
          license_plate: event.license_plate,
          vin_number: event.vin_number,
          company_id: event.company_id,
          color: event.color,
          year: event.year,
          make: event.make,
          model: event.model,
          title: event.title,
          license: event.license,
          registration: event.registration,
          insurance_status: event.insurance_status,
          liability: event.liability,
          collision: event.collision,
          comprehensive: event.comprehensive,
          purchase_price: event.purchase_price,
          date_of_purchase: event.date_of_purchase,
          sales_price: event.sales_price,
          date_of_sales: event.date_of_sales,
          estimated_market_value: event.estimated_market_value,
          source_of_market_value: event.source_of_market_value,
          date_of_market_value: event.date_of_market_value,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  //#endregion




    //#region Inner Navigation Routing
    routeHandler(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
            return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
    }

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    }

    backHandler(): void {
        this._router.navigate(['/apps/equipment/motorized/']);
    }
    //#endregion




}
