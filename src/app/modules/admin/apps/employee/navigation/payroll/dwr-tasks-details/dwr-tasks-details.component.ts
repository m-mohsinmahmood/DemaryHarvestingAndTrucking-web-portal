import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { debounceTime, Observable } from 'rxjs';
import { EmployeeService } from '../../../employee.service';

@Component({
  selector: 'app-dwr-tasks-details',
  templateUrl: './dwr-tasks-details.component.html',
  styleUrls: ['./dwr-tasks-details.component.scss']
})
export class DWRTasksDetails implements OnInit {

  public form: FormGroup;
  closeDialog$: Observable<boolean>;
  payrollPeriodDetails$: Observable<any>;
  isLoadingPayrollPeriodDetails$: Observable<boolean>;
  arr: any;
  routeID; // URL ID





  constructor(
    public matDialogRef: MatDialogRef<DWRTasksDetails>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,





  ) { }

  ngOnInit(): void {
    this.initObservables();
    this.initForm();
    this.initApis();


  }

  initApis() {   
    this._employeeService.getPayrollByPeriodDetails(this.data.id, 'PeriodDetailedSummary', this.form.value)
  }


  //#region Init Observables 
  initObservables() {
    this.isLoadingPayrollPeriodDetails$ = this._employeeService.isLoadingPayrollPeriodDetails$;
    this.payrollPeriodDetails$ = this._employeeService.payrollPeriodDetails$;

  }
  //#endregion

  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion

  onSubmit(): void {


  }


  //#region Form
  initForm() {
    
      
      this.form = this._formBuilder.group({
      from: [''],
      to: ['']

    });
    if (this.data.isEdit) {
      this.form.patchValue({
        from: this.data.from,
        to:this.data.to
      });
    }

    if (this.data){
      this.form.controls['from'].patchValue(moment(this.data.from).format('YYYY-MM-DD'));
      this.form.controls['to'].patchValue(moment(this.data.to).format('YYYY-MM-DD'));
      }
  }


  discard(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    this.matDialogRef.close();
  }

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

}
