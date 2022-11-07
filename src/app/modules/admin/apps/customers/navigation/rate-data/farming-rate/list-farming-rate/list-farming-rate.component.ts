import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddCustomFarmingRateComponent } from '../add-custom-farming-rate/add-custom-farming-rate.component';

@Component({
  selector: 'app-list-farming-rate',
  templateUrl: './list-farming-rate.component.html',
  styleUrls: ['./list-farming-rate.component.scss']
})
export class ListFarmingRateComponent implements OnInit {
  //#region Input
  @Input() farmingRateList: Observable<any>
  //#endregion

  //#region Variables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID: any;
  search: any;
  searchResult: any;
  farmingRateSort: any[] = []
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
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region Add/Edit Dialogues
  openAddFarmingDialog() {
    const dialogRef = this._matDialog.open(AddCustomFarmingRateComponent, {
      data: {
        customerId: this.routeID,
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  openEditFarmingDialog(farmingRate) {
    const dialogRef = this._matDialog.open(AddCustomFarmingRateComponent, {
      data: {
        isEdit: true,
        customerId: this.routeID,
        farmingRate: farmingRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });

  }
  //#endregion

  //#region Delete Farming Rate
  deleteFarmingRate(id: string) {
    this._customerService.deleteFarmingRate(id, this.routeID)
  }
  //#endregion

  //#region Sorting
  sortData(sort: any) {
    this.farmingRateSort[0] = sort.active; this.farmingRateSort[1] = sort.direction;
    this._customerService.getFarmingRate(this.routeID, this.farmingRateSort[0], this.farmingRateSort[1], this.searchResult);
  }
  //#endregion

}
