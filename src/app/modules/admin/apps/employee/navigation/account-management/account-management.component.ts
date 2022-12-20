import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
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

  roles = [{ role: 'Combine Operator', status: false, formRole: 'combineOperatorStatus' },
  { role: 'Tractor/Cart Operator', status: false, formRole: 'tractorCartOperatorStatus' },
  { role: 'Truck Driver', status: false, formRole: 'truckDriverStatus' },
  { role: 'Tractor/Farming Operator', status: false, formRole: 'farmingTractorOperatorStatus' }
  ]
  @Input() employeeRole: any

  //#region  Observables
  employee$: Observable<any>;
  isLoadingEmployee$: Observable<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  //#region Variable
  form: FormGroup;
  routeID: any;
  employeeRoleUpdate: any = [];
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
    this.updateEmployeeRole();
    this.initApis(this.routeID);
    this.initObservables();
    this.initForm();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  //#endregion

  //#region Update Employee array
  updateEmployeeRole() {
    if (this.employeeRole.length > 0) {
      this.employeeRoleUpdate = this.employeeRole.split(',');
      if (this.employeeRoleUpdate.includes('Combine Operator')) {
        this.roles[0].status = true;
      }
      if (this.employeeRoleUpdate.includes('Tractor/Cart Operator')) {
        this.roles[1].status = true;
      }
      if (this.employeeRoleUpdate.includes('Truck Driver')) {
        this.roles[2].status = true;
      }
      if (this.employeeRoleUpdate.includes('Tractor/Farming Operator')) {
        this.roles[3].status = true;
      }
    }
  }

  //#region Initialize Observables
  initObservables() {
    // Data
    this.employee$ = this._employeeService.employee$;
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
      combineOperatorStatus: ['' || (this.roles[0].status ? true : false)],
      tractorCartOperatorStatus: ['' || (this.roles[1].status ? true : false)],
      truckDriverStatus: ['' || (this.roles[2].status ? true : false)],
      farmingTractorOperatorStatus: ['' || (this.roles[3].status ? true : false)],
    });
  }

  //#region Toggle Role Function
  toggleRole(event, index, role) {
    let msg;
    let isRemoved;
    if (this.roles[index].status){
      msg = 'Are you sure you want to remove '+ role + ' role from this employee?',
      isRemoved = false
    }
    else {
      msg = 'Are you sure you want to assign '+ role + ' role to this employee?',
      isRemoved = true
    }
    const dialogRef = this.matDialogRef.open(ConfirmDialogComponent, {
      data: {
        message: msg,
        isRemoved: isRemoved
      },
    });
    dialogRef.afterClosed().subscribe(response => {
      if (this.roles[index].status) {
        if (response === true) {
          this.roles[index].status = !this.roles[index].status;
          let i = this.employeeRoleUpdate.findIndex((x) => { return x === role })
          this.employeeRoleUpdate.splice(i, 1);
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRoleUpdate
          })
        }
        else {
          event.source.checked = true;
        }
      } else {
        if (response === true) {
          this.roles[index].status = !this.roles[index].status;
          this.employeeRoleUpdate.push(role)
          this._employeeService.patchEmployee({
            id: this.routeID,
            role: this.employeeRoleUpdate
          })
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  //#endregion
}
