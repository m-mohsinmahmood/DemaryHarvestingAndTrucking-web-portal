import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddCommercialTruckingRateComponent } from '../add-commercial-trucking-rate/add-commercial-trucking-rate.component';

@Component({
  selector: 'app-list-trucking-rate',
  templateUrl: './list-trucking-rate.component.html',
  styleUrls: ['./list-trucking-rate.component.scss']
})
export class ListTruckingRateComponent implements OnInit {
  //#region Input
  @Input() truckingRateList: Observable<any>
  //#endregion

  //#region Variables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID: any;
  search: any;
  searchResult: any;
  truckingRateSort: any[] = []
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
  openAddTruckingDialog() {
    const dialogRef = this._matDialog.open(AddCommercialTruckingRateComponent, {
      data: {
        customerId: this.routeID,
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  openEditTruckingDialog(truckingRate) {
    const dialogRef = this._matDialog.open(AddCommercialTruckingRateComponent, {
      data: {
        isEdit: true,
        customerId: this.routeID,
        truckingRate: truckingRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  //#endregion

  //#region Delete Trucking Rate
  deleteTruckingRate(id: string) {
    this._customerService.deleteTruckingRate(id, this.routeID)
  }
  //#endregion

  //#region Sorting
  sortData(sort: any) {
    this.truckingRateSort[0] = sort.active; this.truckingRateSort[1] = sort.direction;
    this._customerService.getTruckingRate(this.routeID, this.truckingRateSort[0], this.truckingRateSort[1], this.searchResult);
  }
  //#endregion

}
