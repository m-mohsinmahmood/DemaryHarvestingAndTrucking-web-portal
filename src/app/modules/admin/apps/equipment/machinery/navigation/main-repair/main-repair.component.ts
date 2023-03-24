import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject } from 'rxjs';
import { MachineryService } from '../../machinery.service';
import { Machineries } from '../../machinery.types';
import { EditMainRepair } from './edit-main-repair/edit-main-repair.component';

@Component({
  selector: 'app-machinery-main-repair',
  templateUrl: './main-repair.component.html',
  styleUrls: ['./main-repair.component.scss'],
})
export class MachineryMainRepairComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;


  panelOpenState = false;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProductForm: FormGroup;
  tagsEditMode: boolean = false;
  allExpandState = false;
  isLoadingMaintenanceRepairList$: Observable<boolean>;
  maintenanceRepair$: Observable<Machineries[]>;
  routeID; // URL ID


  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private _machineryService: MachineryService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRouteParams();
    this.initObservables();
    this.initApis();


    console.log("tickets", this.maintenanceRepair$)

  }
  initObservables() {
    this.isLoadingMaintenanceRepairList$ = this._machineryService.isLoadingMaintenanceRepairList$;
    this.maintenanceRepair$ = this._machineryService.maintenanceRepair$;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  initApis() {
    this._machineryService.getMaintenanceRepairList(this.routeID, 'MaintenanceRepairList');

  }

  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion

  openTicketData(id: any): void {
    const dialogRef = this._matDialog.open(EditMainRepair, {
      data:{
        id: id,
        isEdit: true,
      }
    })
  }


}
