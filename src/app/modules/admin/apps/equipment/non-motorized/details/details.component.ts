/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NonMotorizedService } from '../non-motorized.service';
import { EquipmentService } from '../../equipment.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';



@Component({
    selector: 'non-motorized-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NonMotorizedDetailComponent implements OnInit, OnDestroy {

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
    nonMotorizedVehicle$: Observable<any>;
    isLoadingNonMotorizedVehicle$: Observable<any>;
    //#endregion




    /**
     * Constructor
     */
    constructor(

        public activatedRoute: ActivatedRoute,
        public _nonMotorizedService: NonMotorizedService,
        private _router: Router,
        public _equipmentService: EquipmentService,
        private _fuseMediaWatcherService: FuseMediaWatcherService



    ) {
    }

    //#region Lifecycle Functions

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            console.log('PARAMS:', params); //log the entire params object
            this.routeID = params.Id;
            console.log('object', this.routeID);
            console.log(params['id']); //log the value of id
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
        this.nonMotorizedVehicle$ = this._nonMotorizedService.nonMotorizedVehicle$;
        // Loader
        this.isLoadingNonMotorizedVehicle$ = this._nonMotorizedService.isLoadingNonMotorizedVehicle$;
    }
    //#endregion

    //#region Initial APIs
    initApis(id: string) {
        this._nonMotorizedService.getNonMotorizedVehicleById(id);
    }
    //#endregion


    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._equipmentService.navigationLabels;
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
        this._router.navigate(['/apps/equipment/non-motorized/']);
    }

    //#endregion


}
