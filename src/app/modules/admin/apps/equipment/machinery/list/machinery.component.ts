/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
import { MachineryService } from 'app/modules/admin/apps/equipment/machinery/machinery.service';
import { Router } from '@angular/router';
import { UpdateAddMachineryComponent } from '../update/update-add.component';
import { Machineries } from '../machinery.types';
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';

@Component({
    selector: 'machinery-list',
    templateUrl: './machinery.component.html',
    styleUrls: ['./machinery.component.scss'],

    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class MachineryListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    //#region Variables
    machineryFiltersForm: FormGroup;
    created_at: any;
    manufacture_year: any;
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
    machineries$: Observable<Machineries[]>;
    isLoadingMachineries$: Observable<boolean>;
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
        private _machineryService: MachineryService,
        private _matDialog: MatDialog
    ) { }


    //#region Lifecycle Functions

    ngOnInit(): void {
        this.initCreatedAt();
        this.initManufacturedYear();
        this.initApis();
        this.initObservables();
        this.initFiltersForm();
    }


    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion


    //#region Init Observables and Apis
    initObservables() {
        this.isLoadingMachineries$ = this._machineryService.isLoadingMachineries$;
        this.machineries$ = this._machineryService.machineries$;
        this.search = this.searchform.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((data) => {
                this.searchResult = data.search;
                this.page = 1;
                this._machineryService.getMachineries(
                    1,
                    50,
                    '',
                    '',
                    this.searchResult
                );
            });
    }

    initApis() {
        this._machineryService.getMachineries();
    }

    //#endregion

    //#region Details Page

    toggleDetails(machineId: string): void {
        this._router.navigate([
            `/apps/equipment/machinery/details/${machineId}`,
        ]);
    }
    //#endregion

    //#region Add Dialog

    openAddDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateAddMachineryComponent);
        /* const dialogRef = this._matDialog.open(UpdateComponent,{
         data:{id: '7eb7c859-1347-4317-96b6-9476a7e2784578ba3c334343'}
        }); */

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
            });
    }
    //#endregion


    //#region Sort Function
    sortData(sort: any) {
        this.page = 1;
        this.sort = sort.active;
        this.order = sort.direction;
        this._machineryService.getMachineries(
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
       //#region  Pagination
       pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._machineryService.getMachineries(this.page, this.limit, '', '', this.searchResult);
    }
    //#endregion

    //#region Filters
    initCreatedAt() {
        this.created_at = new FormControl();
    }

    initManufacturedYear() {
        this.manufacture_year = new FormControl();
    }
    //#endregion

    //#region Filters
    applyFilters() {
        //debugger
    }

    removeFilters() {
        this.machineryFiltersForm.reset();
        this.initApis();
    }

    initFiltersForm() {
        this.machineryFiltersForm = this._formBuilder.group({
            type: [''],
            make: [''],
            model: [''],
            status: [''],
            created_at: [''],
            manufacture_year:['']
        });
    }

    chosenYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment();
        ctrlValue.year(normalizedYear.year());
        this.created_at.setValue(ctrlValue.format('YYYY'));
        this.machineryFiltersForm.value.created_at = ctrlValue.format('YYYY');
        datepicker.close();
    }

    manufactureYearHandler(
        normalizedYear: Moment,
        datepicker: MatDatepicker<Moment>
    ) {
        const ctrlValue = moment();
        ctrlValue.year(normalizedYear.year());
        this.manufacture_year.setValue(ctrlValue.format('YYYY'));
        this.machineryFiltersForm.value.manufacture_year = ctrlValue.format('YYYY');
        datepicker.close();
    }
    //#endregion
}
