import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddHaulingRateComponent } from '../add-hauling-rate/add-hauling-rate.component';

@Component({
  selector: 'app-list-hauling-rate',
  templateUrl: './list-hauling-rate.component.html',
  styleUrls: ['./list-hauling-rate.component.scss']
})
export class ListHaulingRateComponent implements OnInit {

  //#region Input
  @Input() haulingRateList: Observable<any>
  //#endregion

  //#region Variables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID: any;
  search: any;
  searchResult: any;
  haulingRateSort: any[] = []
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
  openAddHaulingDialog() {
    const dialogRef = this._matDialog.open(AddHaulingRateComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  openEditHaulingDialog(haulingRate) {
    const dialogRef = this._matDialog.open(AddHaulingRateComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        haulingRate: haulingRate,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });

  }
  //#endregion

  //#region Delete Hauling Rate
  deleteHaulingRate(id: string) {
    this._customerService.deleteHaulingRate(id, this.routeID)
  }
  //#endregion

  //#region Sorting
  sortData(sort: any) {
    this.haulingRateSort[0] = sort.active; this.haulingRateSort[1] = sort.direction;
    this._customerService.getHaulingRate(this.routeID, this.haulingRateSort[0], this.haulingRateSort[1], this.searchResult);
  }
  //#endregion

}
