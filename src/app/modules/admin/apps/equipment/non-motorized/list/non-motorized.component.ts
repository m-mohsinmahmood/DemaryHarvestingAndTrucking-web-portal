import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    Subscription,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { NonMotorized } from '../non-motorized.types';
import { NonMotorizedService } from '../non-motorized.service';
import { UpdateAddNonMotorizedComponent } from '../update/update-add.component';

@Component({
    selector: 'non-motorized-list',
    templateUrl: './non-motorized.component.html',
    styleUrls: ['./non-motorized.component.scss'],

    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class NonMotorizedListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    //#region Variables

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProductForm: FormGroup;
    isEdit: boolean = false;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [50, 100, 150, 200];
    searchResult: string;
    page: number;
    sort: any;
    order: any;
    limit: number;
    //#endregion


    //#region Observables
    search: Subscription;
    nonMotorizedList$: Observable<NonMotorized[]>;
    isLoadingNonMotorizedList$: Observable<boolean>;
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion



    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _nonMotorizedService: NonMotorizedService,
        private _matDialog: MatDialog
    ) { }


    //#region Lifecycle Functions

    ngOnInit(): void {
        this.initApis();
        this.initObservables();

    }


    ngAfterViewInit(): void {

    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion


    //#region Init Observables and Apis
    initObservables() {
        this.isLoadingNonMotorizedList$ = this._nonMotorizedService.isLoadingNonMotorizedList$;
        this.nonMotorizedList$ = this._nonMotorizedService.nonMotorizedList$;
        this.search = this.searchform.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((data) => {
                this.searchResult = data.search;
                this.page = 1;
                this._nonMotorizedService.getNonMotorizedVehicles(
                    1,
                    10,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    initApis() {
        this._nonMotorizedService.getNonMotorizedVehicles();
    }

    //#endregion


    //#region Details Page
    toggleDetails(machineId: string): void {
        this._router.navigate([
            `/apps/equipment/non-motorized/details/${machineId}`,
        ]);
    }

    //#endregion

    //#region Add Dialog

    openAddDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateAddNonMotorizedComponent);

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
            });
    }
    //#endregion




    //#region Sort Function
    sortData(sort: any) {
        this.page = 1;
        this._nonMotorizedService.getNonMotorizedVehicles(
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    //#endregion
}
