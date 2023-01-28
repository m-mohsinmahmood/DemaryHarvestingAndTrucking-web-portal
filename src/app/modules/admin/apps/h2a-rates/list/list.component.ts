import {
    AfterViewInit,
    ElementRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    debounceTime,
    Observable,
    Subject,
    switchMap,
    takeUntil,
    interval,
    tap,
    filter,
    Subscription,
} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { H2aRatesService } from '../h2a-rates.services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HourlyRate } from '../h2a-rates.types';
import { read, utils, writeFile } from 'xlsx';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { EditH2aRatesComponent } from '../edit/edit.component';
// import { ImportCropsComponent } from './../import-crops/import-crops.component';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class H2aRateListComponent implements OnInit {
    @ViewChild('input') input: ElementRef;

    //#region Observable
    h2aRate$: Observable<HourlyRate>;
    is_loading_h2aRate$: Observable<boolean>;
    h2aRateList$: Observable<HourlyRate[]>;
    is_loading_h2aRateList$: Observable<boolean>;
    exportH2aRates$: Observable<HourlyRate>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables
  
    search: Subscription;
    sortActive: any;
    sortDirection: any;
    isEdit: boolean = false;
    pageSize = 50;
    currentPage = 0;
    pageSizeOptions: number[] = [50, 100, 150, 200];
    searchResult: string;
    page: number;
    limit: number;
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    
    //#endregion

    constructor(
        private _matDialog: MatDialog,
        private _h2aRatesService: H2aRatesService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initApis();
        this.initObservables();

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Init Observables
    initObservables() {
        this.is_loading_h2aRateList$ = this._h2aRatesService.is_loading_h2aRateList$;
        this.is_loading_h2aRate$ = this._h2aRatesService.is_loading_h2aRate$;
        this.h2aRateList$ = this._h2aRatesService.h2aRateList$;
        this.h2aRate$ = this._h2aRatesService.h2aRate$;
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.page = 1;
                this.searchResult = data.search;
                this._h2aRatesService.getH2aRates(this.page, 50, '', '', this.searchResult);
            });
    }

    //#endregion

    //#region Init Apis
    initApis() {
        this._h2aRatesService.getH2aRates();
    }
    //#endregion

    //#region Add/Edit/Import Dialog
  
    openEditDialog(event): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(EditH2aRatesComponent, {
            data: {
                rateData: {
                    isEdit: this.isEdit,
                    id: event.id,
                    state: event.state,
                    hourly_rate: event.hourly_rate,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => { });
    }
    //#endregion

    //#region Sort Function
    sortData(sort: any) {
        this.sortActive = sort.active;
        this.sortDirection = sort.direction;
        this.page = 1;
        this._h2aRatesService.getH2aRates(
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }
    //#endregion

    //#region Pagination
    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this._h2aRatesService.getH2aRates(this.page, this.limit, this.sortActive, this.sortDirection, this.searchResult);
    }
    //#endregion

}
