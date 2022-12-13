import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { NonMotorizedService } from '../../non-motorized.service';
import { NonMotorized } from '../../non-motorized.types';

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

    //#region init API
    initApi(){
      this._nonMachineryService.getNonMotorizedVehicleById(this.routeID);
  }
  //#endregion

      //#region init Observables
      initObservables(){
        this.isLoadingNonMotorizedVehicle$ = this._nonMachineryService.isLoadingNonMotorizedVehicle$;
        this.nonMotorizedVehicle$ = this._nonMachineryService.nonMotorizedVehicle$;
    }
    //#endregion

}
