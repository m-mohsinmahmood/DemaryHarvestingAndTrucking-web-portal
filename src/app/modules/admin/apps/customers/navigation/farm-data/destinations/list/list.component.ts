import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../../../customers.service';
import { AddDestinationComponent } from '../add-destination/add-destination.component';

@Component({
  selector: 'app-list-destinations',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListDestinationComponent implements OnInit {
  //#region Input
  @Input() customerDestinationList: Observable<any>
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
  destinationSort: any[] = []
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

    // Farm Search
    this.search = this.searchform.valueChanges
      .pipe(debounceTime(500))
      .subscribe((data) => {
        this.searchResult = data.search;
        this.page = 1;
        this._customerService.getCustomerDestination(this.routeID, this.page, 10, '', '', this.searchResult)
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion

  //#region Add/Edit Dialog

  //Destination
  openAddDestinationDialog(): void {
    this.isEdit = false;
    const dialogRef = this._matDialog.open(AddDestinationComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: this.isEdit,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

  openEditDestinationDialog(destination): void {
    this.isEdit = true;
    const dialogRef = this._matDialog.open(AddDestinationComponent, {
      data: {
        isEdit: this.isEdit,
        customer_id: this.routeID,
        customerDestinationData: {
          id: destination.destination_id,
          farm_name: destination.farm_name,
          name: destination.destination_name,
          calendar_year: destination.calendar_year,
          farm_id: destination.farm_id,
          destination_id: destination.destination_id,
          status: destination.status,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  //#endregion

  //#region Delete Destination
  deleteCustomerDestination(id: string) {
    this._customerService.deleteCustomerDestination(id, this.routeID)
  }
  //#endregion

  //#region  Sort Data
  sortData(sort: any) {
    this.page = 1;
    this.destinationSort[0] = sort.active; this.destinationSort[1] = sort.direction;
    this._customerService.getCustomerDestination(this.routeID, this.page, this.limit, this.destinationSort[0], this.destinationSort[1], this.searchResult);
  }
  //#endregion

  //#region Pagination
  pageChanged(event) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this._customerService.getCustomerDestination(this.routeID, this.page, this.limit, this.destinationSort[0], this.destinationSort[1], this.searchResult);
  }
  //#endregion

}
