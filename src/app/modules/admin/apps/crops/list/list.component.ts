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
import { AddCropsComponent } from '../add/add.component';
import { CropService } from '../crops.services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Crops } from '../crops.types';
import { read, utils, writeFile } from 'xlsx';
import { ConfirmationDialogComponent } from 'app/modules/admin/ui/confirmation-dialog/confirmation-dialog.component';
import { ImportCropsComponent } from './../import-crops/import-crops.component';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CropsListComponent implements OnInit {
    @ViewChild('input') input: ElementRef;

    //#region Observable
    crop$: Observable<Crops>;
    is_loading_crop$: Observable<boolean>;
    crops$: Observable<Crops[]>;
    is_loading_crops$: Observable<boolean>;
    exportCrop$: Observable<Crops>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    //#region Variables
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    search: Subscription;
    sortActive: any;
    sortDirection: any;
    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;
    //#endregion

    constructor(
        private _matDialog: MatDialog,
        private _cropsService: CropService,
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
        this.is_loading_crops$ = this._cropsService.is_loading_crops$;
        this.is_loading_crop$ = this._cropsService.is_loading_crop$;
        this.crops$ = this._cropsService.crops$;
        this.crop$ = this._cropsService.crop$;
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.page = 1;
                this.searchResult = data.search;
                this._cropsService.getCrops(this.page, 10, '', '', this.searchResult);
            });
    }

    //#endregion

    //#region Init Apis
    initApis() {
        this._cropsService.getCrops();
    }
    //#endregion

    //#region Add/Edit/Import Dialog
    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCropsComponent);
        dialogRef.afterClosed().subscribe((result) => { });
    }
    openEditDialog(event): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddCropsComponent, {
            data: {
                cropData: {
                    isEdit: this.isEdit,
                    id: event.id,
                    name: event.name,
                    variety: event.variety,
                    bushel_weight: event.bushel_weight,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => { });
    }
    openImportDialog(): void {
        const dialogRef = this._matDialog.open(ImportCropsComponent,{});
        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    //#endregion

    //#region Sort Function
    sortData(sort: any) {
        this.sortActive = sort.active;
        this.sortDirection = sort.direction;
        this.page = 1;
        this._cropsService.getCrops(
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
        this._cropsService.getCrops(this.page, this.limit, this.sortActive, this.sortDirection, this.searchResult);
    }
    //#endregion

    //#region Export/Download Template Function

    handleExport() {
        let allCrops;
        this._cropsService.getCropExport(this.sortActive, this.sortDirection, this.searchResult,)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                allCrops = value
                const headings = [['Crop Name', 'Variety', 'Bushel Weight']];
                const wb = utils.book_new();
                const ws: any = utils.json_to_sheet([]);
                utils.sheet_add_aoa(ws, headings);
                utils.sheet_add_json(ws, allCrops, {
                    origin: 'A2',
                    skipHeader: true,
                });
                utils.book_append_sheet(wb, ws, 'Report');
                writeFile(wb, 'Crop Data.xlsx');
            })

    }

    downloadTemplate() {
        const headings = [['Crop Name', 'Variety', 'Bushel Weight']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Crops Data.xlsx');
    }

    //#region Confirmation Customer Crops Delete Dialog
    confirmDeleteDialog(cropId: string): void {
        const dialogRef = this._matDialog.open(ConfirmationDialogComponent, {
            data: {
                message: 'Are you sure you want to delete this Crop?',
                title: 'Crop',
            },
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult)
                this._cropsService.deleteCrop(cropId);
        });
    }
    //#endregion
}
