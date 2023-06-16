/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { EmployeeService } from '../employee.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import moment from 'moment';
import { states } from './../../../../../../JSON/state';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-all-dwrs',
  templateUrl: './all-dwrs.component.html',
  styleUrls: ['./all-dwrs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class AllDwrsComponent implements OnInit, AfterViewInit, OnDestroy {

  //#region variables
  states: string[] = [];
  page: number = 1;
  pageSize = 200;
  pageSizeOptions: number[] = [50, 100, 150, 200, 250, 300, 350, 500];
  dwrFiltersForm: FormGroup;
  totalWages: number = 0; // Variable to store the total wages
  totalHours: number = 0;
  wagesObj;
  employeeTotalWage: number = 0;
  dateRangeArray: any[] = [];
  allEmployeesList: Observable<any>;
  allSupervisorsList: Observable<any>;
  employee_search$ = new Subject();
  supervisor_search$ = new Subject();
  formValid: boolean;

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  //#endregion

  //#region observable
  allDwrsList$: Observable<any>;
  isLoadingAllDwrs$: Observable<boolean>;
  //#endregion

  constructor(
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
  ) { }

  //#region LifeCycle Hooks
  ngOnInit(): void {
    this.initFiltersForm();
    this.initObservables();
    this.initApis();
    this.employeeSearchSubscription();
    console.log("All Employee", this.allDwrsList$)
    // this.generateDateRange();
  }

  getallEmployees() {
    let value;
    typeof this.dwrFiltersForm.controls['name'].value === 'object' ? (value = this.dwrFiltersForm.controls['name'].value.name) : (value = this.dwrFiltersForm.controls['name'].value);
    this.allEmployeesList = this._employeeService.getAllEmployeesDropDown(value, 'allEmployees', '');
  }
  //#region Auto Complete Crops Display Function
  displayEmployeeForAutoComplete(employees: any) {
    return employees ? `${employees}` : undefined;
  }

  employeeSearchSubscription() {

    this.employee_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allEmployeesList = this._employeeService.getAllEmployeesDropDown(
          value, 'allEmployees', ''
        );
      });
  }



  getallSupervisor() {
    let value;
    typeof this.dwrFiltersForm.controls['supervisor_name'].value === 'object' ? (value = this.dwrFiltersForm.controls['supervisor_name'].value.name) : (value = this.dwrFiltersForm.controls['supervisor_name'].value);
    this.allSupervisorsList = this._employeeService.getAllEmployeesDropDown(value, 'allSupervisors', '');
  }

  displaySupervisorForAutoComplete(supervisor: any) {
    return supervisor ? `${supervisor}` : undefined;
  }
  supervisorSearchSubscription() {

    this.supervisor_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allSupervisorsList = this._employeeService.getAllEmployeesDropDown(
          value, 'allSupervisors', ''
        );
      });
  }

  //#region Validation
  formValidation(e) {
    typeof (e) == 'string' ? (this.formValid = true) : (this.formValid = false)
  }
  //#endregion

  //#endregion


  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }

  //#region Init Methods
  initObservables() {
    this.isLoadingAllDwrs$ = this._employeeService.isLoadingAllDwrs$;
    this.allDwrsList$ = this._employeeService.allDwrsList$;
  }

  initApis() {
    this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value);
  }
  //#endregion

  //#region  Pagination
  pageChanged(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value, this.page, this.pageSize);
  }
  //#endregion

  //#region Filters
  applyFilters() {
    //debugger
    if (this.dwrFiltersForm.get('ending_date').value !== null) {
      if (this.dwrFiltersForm.value.beginning_date) {
        this.dwrFiltersForm.controls['beginning_date'].patchValue(moment(this.dwrFiltersForm.value.beginning_date).format('YYYY-MM-DD'));
      }
      if (this.dwrFiltersForm.value.ending_date) {
        this.dwrFiltersForm.controls['ending_date'].patchValue(moment(this.dwrFiltersForm.value.ending_date).format('YYYY-MM-DD'));
      }
    }
    !this.dwrFiltersForm.value.name ? (this.dwrFiltersForm.value.name = '') : ('');
    !this.dwrFiltersForm.value.state ? (this.dwrFiltersForm.value.state = '') : ('');
    !this.dwrFiltersForm.value.beginning_date ? (this.dwrFiltersForm.value.beginning_date = '') : ('');
    !this.dwrFiltersForm.value.ending_date ? (this.dwrFiltersForm.value.ending_date = '') : ('');
    !this.dwrFiltersForm.value.supervisor_name ? (this.dwrFiltersForm.value.supervisor_name = '') : ('');
    !this.dwrFiltersForm.value.category ? (this.dwrFiltersForm.value.category = '') : ('');
    this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value);

  }

  removeFilters() {
    this.dwrFiltersForm.reset();
    this.dwrFiltersForm.value.name = '';
    this.dwrFiltersForm.value.state = '';
    this.dwrFiltersForm.value.beginning_date = '';
    this.dwrFiltersForm.value.ending_date = '';
    this.dwrFiltersForm.value.supervisor_name = '';
    this.dwrFiltersForm.value.category = '';
    this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value);
  }

  initFiltersForm() {
    this.dwrFiltersForm = this._formBuilder.group({
      name: [''],
      state: [''],
      beginning_date: [''],
      ending_date: [''],
      supervisor_name: [''],
      category: [''],
    });
  }

  totalWage(hours_worked: any, arizona_rate: any, max_rate: any, state: any) {
    if (arizona_rate && max_rate) {
      if (state == 'Arizona') {
        return (
          (
            parseFloat((hours_worked).replace("$", "")) *
            parseFloat((arizona_rate).replace("$", ""))
          ).toFixed(2));
      } else {
        return (
          (
            parseFloat((hours_worked).replace("$", "")) *
            parseFloat((max_rate).replace("$", ""))
          ).toFixed(2));
      }
    }
  }
  wageCalculation(hours: any, rate: any) {

    return (parseFloat(rate) * parseFloat(hours)).toFixed(2);

  }

  individualWage() {
    this.allDwrsList$.forEach((employee) => {
      this.employeeTotalWage += employee.total_wages;
    });
    return this.employeeTotalWage;
  }

  calculateTotalWages(): number {
    this.totalWages = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const payroll of data?.final_wages) {
        for (const state of payroll?.result?.state_details) {
          this.totalWages += parseFloat(state.state_wage);
        }
      }

    });

    return this.totalWages;
  }

  calculateTotalHours(): number {
    this.totalHours = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const payroll of data?.final_wages) {
        for (const state of payroll?.result?.state_details) {
          this.totalHours += parseFloat(state.state_hours);
        }
      }

    });

    return this.totalHours;
  }

  generateDateRange(): void {
    const currentDate = new Date();

    for (let i = 0; i < 26; i++) {
      const startDate = new Date(currentDate.getTime() - ((i + 1) * 14 * 24 * 60 * 60 * 1000));
      const endDate = new Date(currentDate.getTime() - (i * 14 * 24 * 60 * 60 * 1000));

      this.dateRangeArray.push([startDate, endDate]);
    }

    this.dateRangeArray.reverse();
  }

  public getStateList(stateDetails: any[]): string {
    return stateDetails.map(item => item.state).join(', ');
  }


  //#endregion
}



