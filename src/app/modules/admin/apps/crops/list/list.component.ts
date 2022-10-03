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
    Observer,
} from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddCropsComponent } from '../add/add.component';
import { CropService } from '../crops.services';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Crops } from '../crops.types';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CropsListComponent implements OnInit {
    @ViewChild(DatatableComponent) myFilterTable: DatatableComponent;
    @ViewChild('input') input: ElementRef;
    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    searchResult: Subscription;
    crop$: Observable<Crops>;
    crops$: Observable<Crops[]>;
    rows: Observable<any[]>;
    isLoading: boolean = false;
    isEdit: boolean = false;
    searchInputControl: FormControl = new FormControl();
    temp = [];
    //   rows: any = [];
    totalCount: number = 0;
    closeResult: string;
    dataParams: any = {
        pageNnum: '',
        pageSize: '',
    };
    constructor(
        private _matDialog: MatDialog,
        private _cropsService: CropService
    ) {}

    ngOnInit(): void {
        this.rows = this._cropsService.crops$;
        this.searchResult = this.searchform.valueChanges
            .pipe(
                debounceTime(500),
                switchMap((data) => {
                    return this._cropsService.searchCrop(data);
                })
            )
            .subscribe();
        this.isLoading = true;
        this.getAllCrops();
    }
    getAllCrops(): void {
        // this.rows = this._cropsService.crops$;
        // this.rows = this.rows.source._value;
        // this.temp = this.rows;
        this.isLoading = false;
    }

    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCropsComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    openEditDialog(event): void {
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddCropsComponent, {
            data: {
                isEdit: this.isEdit,
                id: event.id,
                name: event.name,
                category: event.category,
                bushel_weight: event.bushel_weight,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
