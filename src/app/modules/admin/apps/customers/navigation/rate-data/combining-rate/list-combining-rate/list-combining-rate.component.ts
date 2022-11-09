import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddCombiningRateComponent } from '../add-combining-rate/add-combining-rate.component';

@Component({
  selector: 'app-list-combining-rate',
  templateUrl: './list-combining-rate.component.html',
  styleUrls: ['./list-combining-rate.component.scss']
})
export class ListCombiningRateComponent implements OnInit {

  //#region Input
  @Input() combiningRateList: Observable<any>
  //#endregion

  //#region Variables
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  routeID: any;
  search: any;
  searchResult: any;
  combiningRateSort: any[] = []
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
  openAddCombiningDialog() {
    const dialogRef = this._matDialog.open(AddCombiningRateComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  openEditCombiningDialog(combiningRate) {
    const dialogRef = this._matDialog.open(AddCombiningRateComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        combiningRate: combiningRate
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  //#endregion

  //#region Delete Combining Rate
  deleteCombiningRate(id: string) {
    this._customerService.deleteCombiningRate(id, this.routeID)
  }
  //#endregion

  //#region Sorting
  sortData(sort: any) {
    this.combiningRateSort[0] = sort.active; this.combiningRateSort[1] = sort.direction;
    this._customerService.getCombiningRate(this.routeID, this.combiningRateSort[0], this.combiningRateSort[1], this.searchResult);
  }
  //#endregion

}
