import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddCropComponent } from '../add-crop/add-crop.component';

@Component({
  selector: 'app-list-crops',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCropComponent implements OnInit {

  //#region Input
  @Input() customerCropList: Observable<any>
  //#endregion

  //#region Search form variables
  searchform: FormGroup = new FormGroup({
    search: new FormControl(),
  });
  //#endregion

  //#region Variables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID: any;
  search: any;
  searchResult: any;
  page: number;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  limit: number;
  cropSort: any[] = []
  isEdit: boolean;
  //#endregion


  constructor(
    private _matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private _customerService: CustomersService,
  ) { }

  //#region Lifecycle hooks
  ngOnInit(): void {

    // get Activated Route
    this.activatedRoute.params.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params) => {
        this.routeID = params.Id;
      });

    // Crop Search
    this.search = this.searchform.valueChanges
      .pipe(debounceTime(500))
      .subscribe((data) => {
        this.searchResult = data.search;
        this.page = 1;
        this._customerService.getCustomerCrops(this.routeID, this.page, 10, '', '', this.searchResult)
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion


  //#region Add/Edit Dialogues  
  openAddCropDialog(): void {
    this.isEdit = false;
    const dialogRef = this._matDialog.open(AddCropComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: this.isEdit,
        status: true
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openEditCropDialog(crop): void {
    this.isEdit = true;
    const dialogRef = this._matDialog.open(AddCropComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: this.isEdit,
        customerCropData: {
          id: crop.customer_crop_id,
          crop_id: crop.crop_id,
          crop_name: crop.crop_name,
          calendar_year: crop.calendar_year,
          status: crop.status
        }
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });

  }
  //#endregion

  //#region Delete Crop
  deleteCustomerCrop(id: string) {
    this._customerService.deleteCustomerCrop(id, this.routeID)
  }
  //#endregion

  //#region  Sort Data
  sortData(sort: any) {
    this.page = 1;
    this.cropSort[0] = sort.active; this.cropSort[1] = sort.direction;
    this._customerService.getCustomerCrops(this.routeID, this.page, this.limit, this.cropSort[0], this.cropSort[1], this.searchResult);
  }
  //#endregion

  //#region Pagination
  pageChanged(event) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this._customerService.getCustomerCrops(this.routeID, this.page, this.limit, this.cropSort[0], this.cropSort[1], this.searchResult);
  }
  //#endregion

}
