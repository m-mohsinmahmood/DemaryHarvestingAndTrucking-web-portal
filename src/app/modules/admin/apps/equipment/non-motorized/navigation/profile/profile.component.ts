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
  pictures: string[] = [];



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
    this.picturesHandling();

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

  //#region pictures handling

  picturesHandling() {
    this.nonMotorizedVehicle$.subscribe((res => {
      if (res) {
        this.pictures = res.pictures?.replace(/\s/g, '').split(',');

      }
    }));

  }
  //#endregion



}
