import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { UpdateProfileData } from './update-profile-data/update.component';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {

  //#region variables
  employeeProfileData: any;
  routeID; // URL ID
  //#endregion

  //#region Observables
  employeeProfileData$: Observable<any>;
  isLoadingEmployeeProfileData$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion


  constructor(
    private _employeeService: EmployeeService,
    private _formBuilder: FormBuilder,
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

  //#region Initialize Observables
  initObservables() {
    this.isLoadingEmployeeProfileData$ = this._employeeService.isLoadingEmployee$;
    this.employeeProfileData$ = this._employeeService.employee$;
    this.employeeProfileData$.subscribe((value)=> {
      this.employeeProfileData = value;
    })
  }
  //#endregion

  //#region Initialize APIs
  initApi() {
    this._employeeService.getEmployeeById(this.routeID);
  }
  //#endregion

  openUpdateDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(UpdateProfileData, {
      data: { 
        id: this.routeID ,
        employeeProfileData: this.employeeProfileData
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
