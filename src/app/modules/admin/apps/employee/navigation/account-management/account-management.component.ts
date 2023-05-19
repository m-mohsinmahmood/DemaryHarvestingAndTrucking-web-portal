import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EmployeeService } from './../../employee.service';
import { Observable, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})

export class AccountManagementComponent implements OnInit {

  roles = [
    { role: 'Director',         status: false, formRole: 'directorStatus' },
    { role: 'Crew Chief',       status: false, formRole: 'crewChiefStatus' },
    { role: 'Recruiter',        status: false, formRole: 'recruiterStatus' },
    { role: 'Combine Operator', status: false, formRole: 'combineOperatorStatus' },
    { role: 'Cart Operator',    status: false, formRole: 'cartOperatorStatus' },
    { role: 'Truck Driver',     status: false, formRole: 'truckDriverStatus' },
    { role: 'Tractor Driver',   status: false, formRole: 'tractorDriverStatus' },
    { role: 'Trainee',          status: false, formRole: 'traineeStatus' },
    { role: 'Trainer',          status: false, formRole: 'trainerStatus' },
    { role: 'Mechanic',         status: false, formRole: 'mechanicStatus' },
    { role: 'Dispatcher',       status: false, formRole: 'dispatcherStatus' },

  ]
  @Input() employee: any

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
    this.initApis();
    this.initObservables();
    this.updateEmployeeRole();
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
    if (this.employee.employee_info.role && this.employee.employee_info.role.length > 0) {
      this.employeeRoleUpdate = this.employee.employee_info.role.split(',');
      if (this.employeeRoleUpdate.includes('Director')) {
        this.roles[0].status = true;
      }
      if (this.employeeRoleUpdate.includes('Crew Chief')) {
        this.roles[1].status = true;
      }
      if (this.employeeRoleUpdate.includes('Recruiter')) {
        this.roles[2].status = true;
      }
      if (this.employeeRoleUpdate.includes('Combine Operator')) {
        this.roles[3].status = true;
      }
      if (this.employeeRoleUpdate.includes('Cart Operator')) {
        this.roles[4].status = true;
      }
      if (this.employeeRoleUpdate.includes('Truck Driver')) {
        this.roles[5].status = true;
      }
      if (this.employeeRoleUpdate.includes('Tractor Driver')) {
        this.roles[6].status = true;
      }
      if (this.employeeRoleUpdate.includes('Trainee')) {
        this.roles[7].status = true;
      }
      if (this.employeeRoleUpdate.includes('Trainer')) {
        this.roles[8].status = true;
      }
      if (this.employeeRoleUpdate.includes('Mechanic')) {
        this.roles[9].status = true;
      }
      if (this.employeeRoleUpdate.includes('Dispatcher')) {
        this.roles[10].status = true;
      }
    }
  }

  //#region Initialize Observables
  initObservables() {
    // Data
    this.employee$ = this._employeeService.employee$;
    this.employee$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.employee = value;
      })
    // Loader
    this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
  }
  //#endregion

  //#region Initial APIs
  initApis() {
    this._employeeService.getEmployeeById(this.routeID, 'false');
  }
  //#endregion

  //#region Init Form
  initForm() {
    this.form = this._formBuilder.group({
      directorStatus: ['' || (this.roles[0].status ? true : false)],
      crewChiefStatus: ['' || (this.roles[1].status ? true : false)],
      recruiterStatus: ['' || (this.roles[2].status ? true : false)],
      combineOperatorStatus: ['' || (this.roles[3].status ? true : false)],
      cartOperatorStatus: ['' || (this.roles[4].status ? true : false)],
      truckDriverStatus: ['' || (this.roles[5].status ? true : false)],
      tractorDriverStatus: ['' || (this.roles[6].status ? true : false)],
      traineeStatus: ['' || (this.roles[7].status ? true : false)],
      trainerStatus: ['' || (this.roles[8].status ? true : false)],
      mechanicStatus: ['' || (this.roles[9].status ? true : false)],
      dispatcherStatus: ['' || (this.roles[10].status ? true : false)],

    });
  }

  //#region Toggle Role Function
  toggleRole(event, index, role) {
    let msg;
    let isRemoved;
    if (this.roles[index].status) {
      msg = 'Are you sure you want to remove ' + role + ' role from this employee?',
        isRemoved = false
    }
    else {
      msg = 'Are you sure you want to assign ' + role + ' role to this employee?',
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
          }, this.employee?.employee_info?.country == 'United States of America' ? 'false' : 'true')
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
          }, this.employee?.employee_info?.country == 'United States of America' ? 'false' : 'true')
        }
        else {
          event.source.checked = false;
        }
      }
    })
  }

  //#endregion
}
