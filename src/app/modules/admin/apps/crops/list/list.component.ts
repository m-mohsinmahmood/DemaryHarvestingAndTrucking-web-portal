/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable arrow-body-style */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
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
import * as XLSX from 'xlsx';
import * as Joi from 'joi';

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

    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    search: Subscription;
    crop$: Observable<Crops>;
    is_loading_crop$: Observable<boolean>;
    crops$: Observable<Crops[]>;
    is_loading_crops$: Observable<boolean>;
    exportCrop$: Observable<Crops>;

    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;

    constructor(
        private _matDialog: MatDialog,
        private _cropsService: CropService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initApis();
        this.initObservables();
    }
    initObservables() {
        this.is_loading_crops$ = this._cropsService.is_loading_crops$;
        this.is_loading_crop$ = this._cropsService.is_loading_crop$;
        this.crops$ = this._cropsService.crops$;
        this.crop$ = this._cropsService.crop$;
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._cropsService.getCrops(1, 10,'','', this.searchResult);
            });
    }

    initApis() {
        this._cropsService.getCrops();
    }

    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCropsComponent);
        dialogRef.afterClosed().subscribe((result) => {
            //Call this function only when success is returned from the create API call//
            //this._cropsService.getCrops();
        });
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
                paginationData: {
                    page: this.page,
                    limit: this.limit,
                    search: this.searchResult,
                },
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            //Call this function only when success is returned from the update API call//
            // this._cropsService.getCrops();
        });
    }

    sortData(sort: any) {
        console.log(sort);
        this._cropsService.getCrops(
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }

    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        this._cropsService.getCrops(page, limit,'','', this.searchResult);
    }
    // Export
    handleExport() {
        const headings = [['Crop Name', 'Variety', 'Bushel Weight']];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        // utils.sheet_add_json(ws, {
        //     origin: 'A2',
        //     skipHeader: true,
        // });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Crops Data.xlsx');
    }
}
