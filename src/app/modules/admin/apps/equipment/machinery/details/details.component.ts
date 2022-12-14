/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateAddMachineryComponent } from '../update/update-add.component';
import { MachineryService } from './../machinery.service';
import { EquipmentService } from '../../equipment.service';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';



@Component({
    selector: 'employee-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    styles: [
        /* language=SCSS */
        `
            .employee-detail-grid {
                grid-template-columns: 10% 50% 30%;

                @screen sm {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen md {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen lg {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MachineryDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID
    vehicleDetails: any;
    routes = [];
    // Sidebar stuff
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = 'Profile';




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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            console.log('PARAMS:', params); //log the entire params object
            this.routeID = params.Id;
            console.log('object', this.routeID);
            console.log(params['id']); //log the value of id
        });


    }

    ngAfterViewInit(): void {
        // this.initApis(this.routeID);
        // this.initObservables();
        this.initSideNavigation();
    }

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
    openUpdateDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateAddMachineryComponent, {
            data: { id: this.routeID }
        });


        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
            });
    }

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

    backHandler(): void {
        this._router.navigate(['/apps/equipment/machinery/']);
    }


}
