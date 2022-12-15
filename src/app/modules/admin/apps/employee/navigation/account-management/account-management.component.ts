import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EmployeeService } from './../../employee.service';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  //#region  Observables
  employee$: Observable<any>;
  isLoadingEmployee$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  //#region Variable
  combineOperatorStatus: boolean = false;
  tractorCartOperatorStatus: boolean = false;
  truckDriverStatus: boolean = false;
  farmingTractorOperatorStatus = false;
  form: FormGroup;
  routeID: any;
  employeeRole: any = [];
  //#endregion

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialog,
    private _employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,

  ) { }

  //#region Lifecycle Hooks

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
    this.initApis(this.routeID);
    this.initObservables();
    this.initForm();
  }

  ngAfterViewInit(): void {
    
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  //#endregion

  //#region Initialize Observables
  initObservables() {
    // Data
    this.employee$ = this._employeeService.employee$;
    this._employeeService.employee$.subscribe((value) => {
      if (value.role && !this.employeeRole.includes(value.role)){
        this.employeeRole = (value.role);
      }
    })
    // Loader
    this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
  }
  //#endregion

  //#region Initial APIs
  initApis(id: string) {
    this._employeeService.getEmployeeById(id);
  }
  //#endregion

  //#region Init Form
  initForm() {
    this.form = this._formBuilder.group({
      combineOperatorStatus: ['' || (this.employeeRole.includes('Combine Operator')? true : false)],
      tractorCartOperatorStatus: ['' || (this.employeeRole.includes('Tractor Cart Operator')? true : false) ],
      truckDriverStatus: ['' || (this.employeeRole.includes('Truck Driver')? true : false)],
      farmingTractorOperatorStatus: ['' || (this.employeeRole.includes('Farming Tractor Operator')? true : false)],
    });
  }

  //#region Toggle Role Functions
  toggleCombineOperator(event) {
    const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (this.combineOperatorStatus) {
        if (response === true) {
          this.combineOperatorStatus = !this.combineOperatorStatus;
          this.employeeRole.push('Combine Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          })
        }
        else {
          event.source.checked = true;
        }
      } else {
        if (response === true) {
          this.combineOperatorStatus = !this.combineOperatorStatus;
          this.employeeRole.push('Combine Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          })
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  toggleTractorCartOperator(event) {
    ;
    const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (this.tractorCartOperatorStatus) {
        if (response === true) {
          this.tractorCartOperatorStatus = !this.tractorCartOperatorStatus;
          this.employeeRole.push('Tractor Cart Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          })
        }
        else {
          event.source.checked = true;
        }
      } else {
        if (response === true) {
          this.tractorCartOperatorStatus = !this.tractorCartOperatorStatus;
          this.employeeRole.push('Tractor Cart Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          })
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  toggleTruckDriver(event) {
    ;
    const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (this.truckDriverStatus) {
        if (response === true) {
          this.truckDriverStatus = !this.truckDriverStatus;
          this.employeeRole.push('Truck Driver')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          });
        }
        else {
          event.source.checked = true;
        }
      } else {
        if (response === true) {
          this.truckDriverStatus = !this.truckDriverStatus;
          this.employeeRole.push('Truck Driver')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          });
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  toggleFarmingTractorOperator(event) {
    ;
    const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(response => {
      if (this.farmingTractorOperatorStatus) {
        if (response === true) {
          this.farmingTractorOperatorStatus = !this.farmingTractorOperatorStatus;
          this.employeeRole.push('Farming Tractor Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          });
        }
        else {
          event.source.checked = true;
        }
      } else {
        if (response === true) {
          this.farmingTractorOperatorStatus = !this.farmingTractorOperatorStatus;
          this.employeeRole.push('Farming Tractor Operator')
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRole
          });
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  //#endregion
}
