import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee.types';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  //#region Observable
  employeeDwr$: Observable<any>;
  isLoadingEmployeeDwr$: Observable<boolean>;
  payrollPeriodDwr$: Observable<any>;
  isLoadingPayrollPeriodDwr$: Observable<boolean>;
  routeID; // URL ID
  @Input() employee: any;
  form: FormGroup;



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,




  ) { }

  ngOnInit(): void {
    this.initForm();

    this.getRouteParams();
    this.initObservables();

    this.initApis();


    // this.formUpdates();
    this.form.controls['to'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.submit();
      }
      );


    console.log(this.payrollPeriodDwr$, this.employeeDwr$, "period")
  }

  initForm() {
    this.form = this._formBuilder.group({
      from: [''],
      to: ['']
    });
  }

  submit(): void {
    if (this.form.get('to').value !== null) {
      if (this.form.value.from) {
        this.form.controls['from'].patchValue(moment(this.form.value.from).format('YYYY-MM-DD'));
      }
      if (this.form.value.to) {
        this.form.controls['to'].patchValue(moment(this.form.value.to).format('YYYY-MM-DD'));
      }

      this._employeeService.getPayrollByPeriod(this.routeID, 'PayrollPeriod', this.form.value)
    }
  }


  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion

  //#region Init Observables
  initObservables() {
    this.employeeDwr$ = this._employeeService.employeeDwr$;
    this.isLoadingEmployeeDwr$ = this._employeeService.isLoadingEmployeeDwr$;

    this.payrollPeriodDwr$ = this._employeeService.payrollPeriodDwr$;
    this.isLoadingPayrollPeriodDwr$ = this._employeeService.isLoadingPayrollPeriodDwr$;

  }

  //#endregion

  //#region Init Apis
  initApis() {
    this._employeeService.getPayrollById(this.routeID);
    this._employeeService.getPayrollByPeriod(this.routeID, 'PayrollPeriod', this.form.value)
  }
  //#endregion

  totalWage(a: any, b: any) {
    if (a && b) {
      return (
        (
          parseFloat((a).replace("$", "")) *
          parseFloat((b).replace("$", ""))
        ).toFixed(2));
    }
  }

  totalPayrollPeriodWage(a: any, b: any) {
    if (a && b) {
      return (
        (
          parseFloat((a).replace("$", "")) *
          parseFloat((b).replace("$", ""))
        ).toFixed(2));
    }
  }

  totalHoursWorked(data){
    debugger;
    let sum = 0; 
    data.forEach(item => {
      sum +=  +item.total_hours_worked;
    });
    console.log(sum);
    if(sum>0)return true;
    else return false;

    
  }

}
