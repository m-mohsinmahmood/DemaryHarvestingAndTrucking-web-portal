import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { MotorizedService } from '../../motorized.service';
import { Motorized } from '../../motorized.types';
import { UpdateAddMotorizedComponent } from '../../update/update-add.component';

@Component({
  selector: 'app-motorized-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class MotorizedProfileComponent implements OnInit {
  //#region Variables
  isLoading: boolean = false;
  isEdit: boolean;
  routeID;
  result: string = '';
  allExpandState = false;
  pictures:string[] = [];


  //#endregion

  //#region Observables
  search: Subscription;
  motorizedVehicle$: Observable<Motorized>;
  isLoadingMotorizedVehicle$: Observable<boolean>;
  //#endregion
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _motorizedService: MotorizedService,
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
    this.picturesHandling();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion


  //#region init API
  initApi() {
    this._motorizedService.getMotorizedVehicleById(this.routeID);
  }
  //#endregion

  //#region init Observables
  initObservables() {
    this.isLoadingMotorizedVehicle$ = this._motorizedService.isLoadingMotorizedVehicle$;
    this.motorizedVehicle$ = this._motorizedService.motorizedVehicle$;
  }
  //#endregion

  picturesHandling(){
    this.motorizedVehicle$.subscribe((res=> { 
      if(res){
      this.pictures = res.pictures?.replace(/\s/g, '').split(',');

  }
}));
      
  }


}
