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
  allExpandState = false;

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

  //#region Lifecycle Functions

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
  //#endregion


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



}