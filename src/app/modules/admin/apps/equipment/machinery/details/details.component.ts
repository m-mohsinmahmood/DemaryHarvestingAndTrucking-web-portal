/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateAddMachineryComponent } from '../update/update-add.component';
import { MachineryService } from './../machinery.service';
import { EquipmentService } from '../../equipment.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';



@Component({
    selector: 'machinery-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MachineryDetailComponent implements OnInit, OnDestroy {

    //#region Variables

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    routeID; // URL ID
    vehicleDetails: any;
    routes = [];
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = 'Profile';
    //#endregion

    //#region Observables
    machinery$: Observable<any>;
    isLoadingMachinery$: Observable<any>;
    isEdit: boolean;
    //#endregion




    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _machineService: MachineryService,
        private _router: Router,
        public _equipmentService: EquipmentService,
        private _fuseMediaWatcherService: FuseMediaWatcherService



    ) {
    }

    //#region Lifecycle Functions

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });

        this.selectedIndex = history.state?.title ? history.state?.title : 'Profile';



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
        this.machinery$ = this._machineService.machinery$;
        // Loader
        this.isLoadingMachinery$ = this._machineService.isLoadingMachinery$;
    }
    //#endregion

    //#region Initial APIs
    initApis(id: string) {
        this._machineService.getMachineryById(id);
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


    //#region helper Functions

    openUpdateDialog(event): void {
        this.isEdit = true;
        //Open the dialog
        const dialogRef = this._matDialog.open(UpdateAddMachineryComponent, {
            data: {
                isEdit: this.isEdit,
                machineryData: {
                    id: event.id,
                    type: event.type,
                    status: event.status,
                    name: event.name,
                    license_plate: event.license_plate,
                    vin_number: event.vin_number,
                    company_id: event.company_id,
                    color: event.color,
                    year: event.year,
                    make: event.make,
                    model: event.model,

                    serial_number: event.serial_number,
                    engine_hours: event.engine_hours,
                    eh_reading: event.eh_reading,
                    separator_hours: event.separator_hours,
                    sh_reading: event.sh_reading,


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
    backHandler(): void {
        this._router.navigate(['/apps/equipment/machinery/']);
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
    //#endregion




}
