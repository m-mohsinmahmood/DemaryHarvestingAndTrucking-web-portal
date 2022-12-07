import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject } from 'rxjs';
import { MachineryService } from '../../machinery/machinery.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from '../../machinery/machinery.types';

@Component({
  selector: 'app-main-repair',
  templateUrl: './main-repair.component.html',
  styleUrls: ['./main-repair.component.scss'],
  styles: [
    /* language=SCSS */
    `
        .machinery-grid {
            grid-template-columns: 25% 20% 20% 15% 14% ;

            @screen sm {
                grid-template-columns: 25% 20% 20% 15% 14%;
            }
            @screen md {
                grid-template-columns: 25% 20% 20% 15% 14%;
            }
            @screen lg {
                grid-template-columns: 25% 20% 20% 15% 14%;
            }
        }
    `,
],
})
export class MainRepairComponent implements OnInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _inventoryService: MachineryService,
        private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
            // Get the products
            this.products$ = this._inventoryService.products$;


  }
  

}
