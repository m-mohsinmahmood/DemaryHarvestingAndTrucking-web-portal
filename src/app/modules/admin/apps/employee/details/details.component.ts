import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';

@Component({
    selector: 'employee-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {

    //#region  Observables
    employee$: Observable<any>;
    isLoadingEmployee$: Observable<any>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables
    isLoading: boolean = false;
    routeID; // URL ID
    employees: any;
    note: string;
    file: string;
    routes = [];
    // Sidebar stuff
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    selectedIndex: string = "Employee Data";
    employee: any;

    //#endregion

    constructor(
        public activatedRoute: ActivatedRoute,
        public _employeeService: EmployeeService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,

    ) { }

    //#region Life Cycle Hooks
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        })
        this.routes = this._employeeService.navigationLabels;
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
        this.employee$ = this._employeeService.employee$;
        this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
        // Loader
    }
    //#endregion

    //#region Initial APIs
    initApis(id: string) {
        //this._employeeService.getEmployeeById(id, 'false');
        this._employeeService.getEmployeeDocs(id);
    }
    //#endregion

    //#region Initialize Side Navigation
    initSideNavigation() {
        this.routes = this._employeeService.navigationLabels;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    //#region Inner Navigation Routing
    routeHandler(index) {
        const { title } = index;
        if (title === this.selectedIndex) {
            return;
        }
        // this.isLoading = true;
        this.selectedIndex = title;
    };

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    };
    //#endregion

    backHandler(): void {
        this._router.navigate(['/apps/employee/']);
    }

    //#region trackByFn
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    //#endregion

}
