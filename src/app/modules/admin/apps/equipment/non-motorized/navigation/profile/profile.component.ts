import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { NonMotorizedService } from '../../non-motorized.service';
import { NonMotorized } from '../../non-motorized.types';
import { UpdateAddNonMotorizedComponent } from '../../update/update-add.component';

@Component({
  selector: 'app-non-motorized-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class NonMotorizedProfileComponent implements OnInit {
  //#region Variables
  isLoading: boolean = false;
  isEdit: boolean;
  routeID;
  result: string = '';
  allExpandState = false;


  //#endregion

  //#region Observables
  search: Subscription;
  nonMotorizedVehicle$: Observable<NonMotorized>;
  isLoadingNonMotorizedVehicle$: Observable<boolean>;
  //#endregion
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _nonMachineryService: NonMotorizedService,
    private _matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,


  ) { }
  //#region Lifecycle Functions

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
    this.initApi();
    this.initObservables();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion


  //#region init API
  initApi() {
    this._nonMachineryService.getNonMotorizedVehicleById(this.routeID);
  }
  //#endregion

  //#region init Observables
  initObservables() {
    this.isLoadingNonMotorizedVehicle$ = this._nonMachineryService.isLoadingNonMotorizedVehicle$;
    this.nonMotorizedVehicle$ = this._nonMachineryService.nonMotorizedVehicle$;
  }
  //#endregion

  //#region Update Dialog
  openUpdateDialog(event): void {
    this.isEdit = true;
    //Open the dialog
    const dialogRef = this._matDialog.open(UpdateAddNonMotorizedComponent, {
      data: {
        isEdit: this.isEdit,
        nonMotorizedData: {
          id: event.id,
          type: event.type,
          status: event.status,
          name: event.name,
          license_plate: event.license_plate,
          vin_number: event.vin_number,
          company_id: event.company_id,
          color: event.color,
          year: event.year,
          make: event.make,
          model: event.model,
          title: event.title,
          license: event.license,
          registration: event.registration,
          insurance_status: event.insurance_status,
          liability: event.liability,
          collision: event.collision,
          comprehensive: event.comprehensive,
          purchase_price: event.purchase_price,
          date_of_purchase: event.date_of_purchase,
          sales_price: event.sales_price,
          date_of_sales: event.date_of_sales,
          estimated_market_value: event.estimated_market_value,
          source_of_market_value: event.source_of_market_value,
          date_of_market_value: event.date_of_market_value,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  //#endregion

}
