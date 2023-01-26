import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    this.getRouteParams();
    this.initApis();
    this.initObservables();
    this.initForm();
    // this.formUpdates();
    this.form.controls['payroll_period_end'].valueChanges.subscribe(
      () => {
        this.submit();     
      }
  );
  }

  initForm() {
    this.form = this._formBuilder.group({
      payroll_period_start: [''],
      payroll_period_end: ['']
    });
  }

  submit(): void {
    if(this.form.get('payroll_period_end').value !== null){

    console.log(this.form.get('payroll_period_start').value.format('D-MM-YYYY'), this.form.get('payroll_period_end').value.format('D-MM-YYYY'));
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

  }

  //#endregion

  //#region Init Apis
  initApis() {
    this._employeeService.getPayrollById(this.routeID);
  }
  //#endregion

  totalWage(a: any, b: any) {
    return (
      (
        parseFloat((a).replace(/\$/g, '')) *
        parseFloat((b).replace(/\$/g, ''))
      ).toFixed(2));
  }

}
