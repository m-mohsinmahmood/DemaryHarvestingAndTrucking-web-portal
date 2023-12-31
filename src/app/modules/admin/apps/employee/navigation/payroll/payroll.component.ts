import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee.types';
import { DWRTasksDetails } from './dwr-tasks-details/dwr-tasks-details.component';
import { PeriodicPayrollDetails } from './periodic-payroll-details/periodic-payroll-details.component';
import * as XLSX from 'xlsx';

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
  payrollPeriodDetails$: Observable<any>;
  isLoadingPayrollPeriodDetails$: Observable<boolean>;
  totalWages: number;


  routeID; // URL ID
  @Input() employee: any;
  form: FormGroup;
  periodToFromDates: FormGroup;



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog





  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initPeriodDatesForm();
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


    console.log(this.payrollPeriodDwr$, this.employeeDwr$, "hellooooo")
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
  removeFarmingFilters(){
    this.form.controls['from'].setValue('');
    this.form.controls['to'].setValue('');

    this._employeeService.getPayrollByPeriod(this.routeID, 'PayrollPeriod', this.form.value)

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

    this.isLoadingPayrollPeriodDetails$ = this._employeeService.isLoadingPayrollPeriodDetails$;
    this.payrollPeriodDetails$ = this._employeeService.payrollPeriodDetails$;

  }

  //#endregion

  //#region Init Apis
  initApis() {
    this._employeeService.getPayrollById(this.routeID);
    this._employeeService.getPayrollByPeriod(this.routeID, 'PayrollPeriod', this.form.value)

  
  }
  //#endregion

  totalWage(hours_worked: any, arizona_rate:any, max_rate:any, state:any ) {
    if (arizona_rate && max_rate) {
      if(state== 'Arizona')
      {
      return (
        (
          parseFloat((hours_worked)) *
          parseFloat((arizona_rate))
        ).toFixed(2));
      } else {
        return (
          (
            parseFloat((hours_worked)) *
            parseFloat((max_rate))
          ).toFixed(2));
      }
    }
    
  }

  totalPayrollPeriodWage(a: any, b: any) {
    if (a && b) {
      return (
        (
          parseFloat((a)) *
          parseFloat((b))
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
  initPeriodDatesForm() {
    this.periodToFromDates = this._formBuilder.group({
    from: [''],
    to: ['']

  });
}



  toggleDetails(from:any , to:any){
    const dialogRef = this._matDialog.open(PeriodicPayrollDetails, {
      data:{
        id:this.routeID,
        from: from,
        to: to,
      }
    })
  }
  toggleDWRTasks(id:any)
  {
    console.log(id)
    const dialogRef = this._matDialog.open(DWRTasksDetails, {
      data:{
        id:id,
      }
    })
  }

}
