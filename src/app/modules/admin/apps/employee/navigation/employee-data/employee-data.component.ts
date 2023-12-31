import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { UpdateEmployeeComponent } from './update/update.component';

@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss']
})
export class EmployeeDataComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';

  //#region variables
  employeeData;
  isEditMode: boolean = false;
  routeID; // URL ID

  //#endregion

  //#region Observables
  employeeData$: Observable<any>;
  isLoadingEmployeeData$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _employeeService: EmployeeService,
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
    this.isLoadingEmployeeData$ = this._employeeService.isLoadingEmployee$;
    this.employeeData$ = this._employeeService.employee$;
      this.employeeData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.employeeData = value;
        console.log(this.employeeData);

      })
  }
  //#endregion

  //#region Initialize APIs
  initApi() {
    this._employeeService.getEmployeeById(this.routeID, 'false');
  }
  //#endregion

  openUpdateDialog(): void {
    const dialogRef = this._matDialog.open(UpdateEmployeeComponent, {
      data: {
        id: this.routeID,
        employeeData: this.employeeData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

  //#region find country code
  getCountryCode(country_code) {
    if (country_code && country_code != 'zz')
      return '+' + country_code?.split("+")[1];
  }
  //#endregion

  //#region  Tab Change
  tabChanged(event) {
    switch (event.tab.textLabel) {
      case 'Onboarding':
        break;
      case 'CDL':
        break;
      case 'Work':
        break;
      case 'Miscellaneous':
        break;
      default:
    }
  }
  //#endregion

  downloadResume(link) {
    window.open(link, "_blank");
  }
}
