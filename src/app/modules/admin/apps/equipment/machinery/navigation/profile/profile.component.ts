import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { UpdateAddMotorizedComponent } from '../../../motorized/update/update-add.component';
import { MachineryService } from '../../machinery.service';
import { Machineries } from '../../machinery.types';
import { UpdateAddMachineryComponent } from '../../update/update-add.component';
@Component({
  selector: 'app-machinery-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class MachineryProfileComponent implements OnInit {
  //#region Variables
  isLoading: boolean = false;
  isEdit: boolean;
  routeID;
  result: string = '';
  //#endregion

  //#region Observables
  search: Subscription;
  machinery$: Observable<Machineries>;
  isLoadingMachinery$: Observable<boolean>;
  //#endregion
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _machineryService: MachineryService,
    private _matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
    this.initApi();
    this.initObservables();
    console.log(this.machinery$)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  //#region init API
  initApi() {
    this._machineryService.getMachineryById(this.routeID);
  }
  //#endregion

  //#region init Observables
  initObservables() {
    this.isLoadingMachinery$ = this._machineryService.isLoadingMachinery$;
    this.machinery$ = this._machineryService.machinery$;
  }
  //#endregion

  //#region Update Dialog
  openUpdateDialog(event): void {
    console.log('dddd', event)
    this.isEdit = true;
    //Open the dialog
    const dialogRef = this._matDialog.open(UpdateAddMachineryComponent, {
      data: {
        isEdit: this.isEdit,
        machineryData: {
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
