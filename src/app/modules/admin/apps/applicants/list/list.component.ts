import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { AddComponent } from '../add/add.component';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ApplicantsListComponent implements OnInit {
  isLoading: boolean = false;
  
  constructor(
    // private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _inventoryService: InventoryService,
    private _matDialog: MatDialog) { }

  ngOnInit(): void {
  
  }
  
  openAddDialog(): void
  {
      // Open the dialog
      const dialogRef = this._matDialog.open(AddComponent, {
        height: '900vh',
        disableClose: true,
        /*position: {
          top: '0',
          left: '0'
        },*/
        autoFocus: false
      });

      dialogRef.afterClosed()
               .subscribe((result) => {
                   console.log('Compose dialog was closed!');
               });
  }

}
