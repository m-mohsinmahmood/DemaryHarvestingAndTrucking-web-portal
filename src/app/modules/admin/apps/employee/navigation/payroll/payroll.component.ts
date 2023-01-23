import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee.types';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  //#region Observable
  employeeDwr$: Observable<Employee>;
  routeID; // URL ID
  @Input () employee: any;


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,



  ) { }

  ngOnInit(): void {
    this.getRouteParams();
    this.initApis();
    this.initObservables();
    console.log(this.employeeDwr$);
  }

  
  //#region route params function
  getRouteParams(){
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion

  //#region Init Observables
  initObservables() {
    this.employeeDwr$ = this._employeeService.employeeDwr$;

  }

  //#endregion

  //#region Init Apis
  initApis() {
    this._employeeService.getPayrollById(this.routeID);
  }
  //#endregion

}
