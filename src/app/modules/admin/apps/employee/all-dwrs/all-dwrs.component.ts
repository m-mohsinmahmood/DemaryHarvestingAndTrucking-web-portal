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
import { CurrencyPipe, formatDate } from '@angular/common';
import { utils, writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatSort, Sort } from '@angular/material/sort';

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
  sort: MatSort = new MatSort();
  order: any;
  limit: number;

  pageSizeOptions: number[] = [50, 100, 150, 200, 250, 300, 350, 500];
  dwrFiltersForm: FormGroup;
  totalWages: number = 0; // Variable to store the total wages
  topTenWages: number = 0; // Variable to store the total wages
  totalHours: number = 0;
  topTenWorkingHours: number = 0;
  wagesObj;
  employeeTotalWage: number = 0;
  dateRangeArray: any[] = [];
  allEmployeesList: Observable<any>;
  allSupervisorsList: Observable<any>;
  employee_search$ = new Subject();
  supervisor_search$ = new Subject();
  formValid: boolean;
  lastSortDirection: string;
  sortDirection: 'asc' | 'desc' = 'asc';

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
    this.states = states;

    console.log("All Employee", this.allDwrsList$)
    // this.generateDateRange();
  }

  getallEmployees() {
    let value;
    typeof this.dwrFiltersForm.controls['employee_id'].value === 'object' ? (value = this.dwrFiltersForm.controls['employee_id'].value?.name) : value = this.dwrFiltersForm.controls['employee_id'].value;
    !value ? value = '' : '';
    this.allEmployeesList = this._employeeService.getAllEmployeesDropDown(value, 'allEmployees', '');
  }
  //#region Auto Complete Crops Display Function
  displayEmployeeForAutoComplete(employees: any) {
    return employees ? `${employees.first_name} ${employees.last_name}` : undefined;
  }

  employeeSearchSubscription() {

    this.employee_search$
      .pipe(
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
    typeof this.dwrFiltersForm.controls['supervisor_id'].value === 'object' ? (value = this.dwrFiltersForm.controls['supervisor_id'].value?.name) : value = this.dwrFiltersForm.controls['supervisor_id'].value;
    !value ? value = '' : '';
    this.allSupervisorsList = this._employeeService.getAllEmployeesDropDown(value, 'allSupervisors', ''); 
    // this.allSupervisorsList.subscribe((val)=>console.log(val));
  }

  displaySupervisorForAutoComplete(supervisor: any) {
    return supervisor ? `${supervisor.first_name} ${supervisor.last_name}` : undefined;
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
  // pageChanged(event) {
  //   this.page = event.pageIndex + 1;
  //   this.pageSize = event.pageSize;
  //   this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value, this.page, this.pageSize);
  // }
  //#endregion

  //#region Filters
  applyFilters() {
    this.dwrFiltersForm.value['supervisor_id'] = this.dwrFiltersForm.value['supervisor_id']?.id != undefined ? this.dwrFiltersForm.value['supervisor_id']?.id : "";
    this.dwrFiltersForm.value['employee_id'] = this.dwrFiltersForm.value['employee_id']?.id != undefined ? this.dwrFiltersForm.value['employee_id']?.id : this.dwrFiltersForm.value['employee_id'].id;

    if (this.dwrFiltersForm.get('ending_date').value !== null) {
      if (this.dwrFiltersForm.value.beginning_date) {
        this.dwrFiltersForm.controls['beginning_date'].patchValue(moment(this.dwrFiltersForm.value.beginning_date).format('YYYY-MM-DD'));
      }
      if (this.dwrFiltersForm.value.ending_date) {
        this.dwrFiltersForm.controls['ending_date'].patchValue(moment(this.dwrFiltersForm.value.ending_date).format('YYYY-MM-DD'));
      }
    }
    !this.dwrFiltersForm.value.status ? (this.dwrFiltersForm.value.status = '') : ('');
    !this.dwrFiltersForm.value.state ? (this.dwrFiltersForm.value.state = '') : ('');
    !this.dwrFiltersForm.value.beginning_date ? (this.dwrFiltersForm.value.beginning_date = '') : ('');
    !this.dwrFiltersForm.value.ending_date ? (this.dwrFiltersForm.value.ending_date = '') : ('');
    !this.dwrFiltersForm.value.supervisor_id ? (this.dwrFiltersForm.value.supervisor_id = '') : ('');
    !this.dwrFiltersForm.value.employee_id ? (this.dwrFiltersForm.value.employee_id = '') : ('');
    // !this.dwrFiltersForm.value.category ? (this.dwrFiltersForm.value.category = '') : ('');
    if(this.dwrFiltersForm.value['employee_id'].toString() === "[object Object]"){
      this.dwrFiltersForm.value['employee_id'] = this.dwrFiltersForm.value['employee_id'].id

    }

    if(this.dwrFiltersForm.value['supervisor_id'].toString() === "[object Object]"){
      this.dwrFiltersForm.value['supervisor_id'] = this.dwrFiltersForm.value['supervisor_id'].id

    }

    this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value);

  }

  removeFilters() {
    this.dwrFiltersForm.reset();
    this.dwrFiltersForm.value.status = '';
    this.dwrFiltersForm.value.state = '';
    this.dwrFiltersForm.value.beginning_date = '';
    this.dwrFiltersForm.value.ending_date = '';
    this.dwrFiltersForm.value.supervisor_id = '';
    this.dwrFiltersForm.value.employee_id = '';
    // this.dwrFiltersForm.value.category = '';
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
      supervisor_id:[''],
      employee_id:[''],
      status:['']
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
        if(payroll.result.total_wages)
          this.totalWages += parseFloat(payroll.result.total_wages);

      }

    });

    return this.toDecimalPoint(this.totalWages.toFixed(2));
  }

  calculateTotalHours(): number {
    this.totalHours = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const payroll of data?.final_wages) {
        if(payroll.result?.total_hours)
        {
          this.totalHours += parseFloat(payroll.result?.total_hours);

        }
      }

    });

    return this.totalHours;
  }

  calculateTotalHoursSingleDwr(): number {
    this.totalHours = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const dwr of data?.dwrTasks) {
        if(dwr.hours_worked)
        {
          this.totalHours += parseFloat(dwr?.hours_worked);

        }
      }

    });

    return this.totalHours;
  }

  calculateTotalSingleWages(): number {
    this.totalWages = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const dwr of data?.dwrTasks) {
        if(dwr.wage)
          this.totalWages += parseFloat(dwr.wage);

      }

    });

    return this.toDecimalPoint(this.totalWages.toFixed(2));
  }


  calculateTopTenTotalHours(): number {
    this.topTenWorkingHours = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const hoursWorked of data?.top_ten_wages) {
        if(hoursWorked.hours_worked)
        {
          this.topTenWorkingHours += parseFloat(hoursWorked.hours_worked);

        }
      }

    });

    return this.topTenWorkingHours;
  }


  calculateTopTenWagesTotal(): number {
    this.topTenWages = 0; // Reset the total wages
    this.allDwrsList$.subscribe(data => {
      for (const wage of data?.top_ten_wages) {
        if(wage.wages)
          this.topTenWages += parseFloat(wage.wages);

      }

    });

    return this.toDecimalPoint(this.topTenWages.toFixed(2));
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


  exportToExcel(): void {
    const wb = XLSX.utils.book_new();
  
    this.allDwrsList$.subscribe((val) => {
      const employee = val;
  
      // Prepare data for export
      const data = [];
      const headerRow = [
        'Employee Name',
        'Supervisors',
        'State Details',
        'Total Hours',
        'Hourly Rates',
        'Total Wages'
      ];
      data.push(headerRow);
  
      employee?.final_wages.forEach((payroll) => {
        payroll?.result.state_details.forEach((state) => {
          const row = [
            payroll.result.employee_name,
            payroll.result.supervisors?.join(', ') || 'No supervisors found',
            state.state,
            state.state_hours,
            state.state === 'arizona' ? '15.62' : '18.65',
            state.state_wage
          ];
          data.push(row);
        });
      });
      // Calculate total hours and total wages
      const totalHours = this.calculateTotalHours().toFixed(2);
      const totalWages = this.calculateTotalWages();
  
      // Add totals row
      const totalsRow = ['', '', '', "Total Hours: " + totalHours, '', "Total Wages: " + totalWages];
      data.push(totalsRow);
  
      // Create the worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wsName = 'DWR Data';
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, wsName);
  
      // Generate the Excel file and save it
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const date = new Date().toISOString().slice(0, 10);
      const filename = `dwr_data_${date}.xlsx`;
      const file = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(file, filename);
    });
  }
  

  exportTopTenDataExcel(): void {
      const wb = XLSX.utils.book_new();
    
      this.allDwrsList$.subscribe((val) => {
        const employee = val;
    
        // Prepare data for export
        const data = [];
        const headerRow = [
          'Employee Name',
          'Total Hours Worked',
          'Total Wages'
        ];
        data.push(headerRow);
    
        employee?.top_ten_wages.forEach((payroll) => {
          const row = [
            payroll.employee_name,
            payroll.hours_worked,
            this.wagesToFloat(payroll.wages)
          ];
          data.push(row);
        });
    
        // Calculate total hours and total wages
        const totalHours = this.calculateTopTenTotalHours().toFixed(2);
        const totalWages = this.calculateTopTenWagesTotal();
    
        // Add totals row
        const totalsRow = ['Total =', totalHours, totalWages];
        data.push(totalsRow);
    
        // Create the worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wsName = 'Top Ten Wages Data';
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, wsName);
    
        // Generate the Excel file and save it
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const date = new Date().toISOString().slice(0, 10);
        const filename = `top_ten_wages_data_${date}.xlsx`;
        const file = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(file, filename);
      });
    
    
  }

  
  
  //#endregion



  //#region Sort Function
  sortData(event: Sort) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  
    this.page = 1;
    
    console.log(this.sortDirection);
    
    this._employeeService.getDwrList(
      'dwrList',
      this.dwrFiltersForm.value,
      this.page,
      this.limit,
      event.active,
      this.sortDirection
    );
    
    this.sort.active = event.active;
    this.sort.direction = this.sortDirection;
  }
  wagesToFloat(wages:any){
    return parseFloat(wages).toFixed(2);
  }

  toDecimalPoint(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  
//#endregion

getShortUUID(uuid): string {
  const shortUUID = uuid.replace(/-/g, '').substring(0, 8);
  return shortUUID;
}

//#region single dwr export

exportExcelSingleDwr() {
  // Create a new workbook
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  // Define the columns and headers for the worksheet
  const columns = ['Name', 'Date', 'State', 'Category', 'Check In', 'Check Out', 'Hours', 'Hourly Rate', 'Wages', 'Status', 'Supervisor', 'Ticket ID', 'Notes'];

  // Create a new worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header: columns });

  // Extract the grid data
  const gridData = this.getGridData();

  // Add the grid data to the worksheet
  XLSX.utils.sheet_add_json(worksheet, gridData, { skipHeader: true, origin: -1 });

  // Get the range for the last row
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const lastRow = range.e.r;

  // Add an empty row

  // Calculate total hours and total wages
  const totalHours = this.calculateTotalHours().toFixed(2);
  const totalWages = this.calculateTotalWages();

  // Add totals row
  const totalsRow = ['', '', '','','','', "Total Hours: " + totalHours, '','','', "Total Wages: " + totalWages];
  const totalRowIndex = gridData.length + 1; // Add 2 to skip the header row and start from the next row after the data
  XLSX.utils.sheet_add_json(worksheet, [totalsRow], { origin: totalRowIndex });

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grid Data');

  // Export the workbook to an Excel file
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveExcelFile(excelBuffer, 'DWR Data Detailed.xlsx');
}

getGridData() {
  const gridData = [];
  const rows = document.getElementsByClassName('single-dwr-grid');
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowData = {
      Name: row.children[0].textContent.trim(),
      Date: row.children[1].textContent.trim(),
      State: row.children[2].textContent.trim(),
      Category: row.children[3].textContent.trim(),
      'Check In': row.children[4].textContent.trim(),
      'Check Out': row.children[5].textContent.trim(),
      Hours: row.children[6].textContent.trim(),
      'Hourly Rate': row.children[7].textContent.trim(),
      Wages: row.children[8].textContent.trim(),
      Status: row.children[9].textContent.trim(),
      Supervisor: row.children[10].textContent.trim(),
      'Ticket ID': row.children[11].textContent.trim(),
      Notes: row.children[12].textContent.trim(),
    };
    gridData.push(rowData);
  }
  return gridData;
}

saveExcelFile(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url: string = window.URL.createObjectURL(data);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}


//#endregion



//#region export by state

exportExcelSingleDwrByState() {
  // Create a new workbook
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  // Extract the grid data
  const gridDataByState = this.getGridDataByState();

  // Define the columns and headers for the worksheet
  const columns = [
    { header: 'State', key: 'State' },
    { header: 'Employee', key: 'Employee' },
    { header: 'Hours', key: 'Hours' },
    { header: 'Hourly Rate', key: 'Hourly Rate' },
    { header: 'Wages', key: 'Wages' },
  ];

  // Convert the grid data to a worksheet with the specified columns and headers
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(gridDataByState);

  // Calculate and add the total hours and wages row
  const totalHours = this.calculateTotalHoursSingleDwr();
  const totalWages = this.calculateTotalSingleWages();
  const totalRow = {
    State: '',
    Employee: 'Total',
    Hours: totalHours,
    'Hourly Rate': '',
    Wages: totalWages,
  };
  const totalRowIndex = gridDataByState.length + 2; // Add 2 to skip the header row and start from the next row after the data
  XLSX.utils.sheet_add_json(worksheet, [totalRow], { origin: totalRowIndex });

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Grid Data');

  // Export the workbook to an Excel file
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveExcelFile(excelBuffer, 'DWR Data By State.xlsx');
}

getGridDataByState() {
  const gridDataByState = [];
  const rows = document.getElementsByClassName('single-dwr-grid');
  let currentState = '';
  let stateTotalHours = 0;
  let stateTotalWages = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const state = row.children[2].textContent.trim();
    const hours = parseFloat(row.children[6].textContent.trim().replace(',', ''));
    const wages = parseFloat(row.children[8].textContent.trim().replace('$', '').replace(',', ''));

    if (currentState !== state && currentState !== '') {
      if (stateTotalHours !== 0 && stateTotalWages !== 0) {
        const stateTotalRow = {
          State: '',
          Employee: 'Subtotal',
          Hours: stateTotalHours,
          'Hourly Rate': '',
          Wages: stateTotalWages,
        };
        gridDataByState.push(stateTotalRow);
      }
      stateTotalHours = 0;
      stateTotalWages = 0;
    }

    if (currentState !== state) {
      currentState = state;
    }

    const rowData = {
      Employee: row.children[0].textContent.trim(),
      State: currentState === state ? state : '',
      Hours: hours,
      'Hourly Rate': row.children[7].textContent.trim(),
      Wages: wages,
    };

    gridDataByState.push(rowData);

    stateTotalHours += hours;
    stateTotalWages += wages;
  }

  // Add the final state subtotal row
  if (currentState !== '') {
    if (stateTotalHours !== 0 && stateTotalWages !== 0) {
      const stateTotalRow = {
        Employee: 'Subtotal',
        State: '',
        Hours: stateTotalHours,
        'Hourly Rate': '',
        Wages: stateTotalWages,
      };
      gridDataByState.push(stateTotalRow);
    }
  }

  return gridDataByState;
}



saveExcelFileByState(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url: string = window.URL.createObjectURL(data);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}
//#endregion

//#region export by supervisor
exportExcelSingleDwrBySupervisor() {
  // Create a new workbook
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  // Extract the grid data
  const gridDataBySupervisor = this.getGridDataBySupervisor();

  // Define the columns and headers for the worksheet
  const columns = ['Supervisor', 'Employee', 'Hours', 'Hourly Rate', 'Wages','Date'];

  // Convert the grid data to a worksheet with the specified columns and headers
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(gridDataBySupervisor, { header: columns });

  // Calculate and add the subtotal rows for each supervisor
  const supervisors = Array.from(new Set(gridDataBySupervisor.map(item => item.Supervisor)));
  supervisors.forEach(supervisor => {
    const supervisorData = gridDataBySupervisor.filter(item => item.Supervisor === supervisor);
    const totalHours = supervisorData.reduce((sum, item) => sum + item.Hours, 0);
    const totalWages = supervisorData.reduce((sum, item) => sum + item.Wages, 0);

    const subtotalRow = {
      Supervisor: supervisor,
      Employee: 'Subtotal',
      Hours: totalHours,
      'Hourly Rate': '',
      Wages: totalWages,
      Date: '',

    };
    gridDataBySupervisor.push(subtotalRow);
  });

  // Calculate the total hours and total wages for all supervisors
  const totalHoursAll = gridDataBySupervisor.reduce((sum, item) => sum + item.Hours, 0);
  const totalWagesAll = gridDataBySupervisor.reduce((sum, item) => sum + item.Wages, 0);

  // Remove the subtotal rows for each supervisor
  gridDataBySupervisor.splice(-supervisors.length);

  // Add the total row for all supervisors at the end
  const totalRowAll = {
    Supervisor: 'Total',
    Employee: '',
    Hours: totalHoursAll,
    'Hourly Rate': '',
    Wages: totalWagesAll,
    Date: '',

  };
  gridDataBySupervisor.push(totalRowAll);

  // Convert the updated grid data to a worksheet with the specified columns and headers
  const updatedWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(gridDataBySupervisor, { header: columns });

  // Add the updated worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, updatedWorksheet, 'Grid Data');

  // Export the workbook to an Excel file
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveExcelFileBySupervisor(excelBuffer, 'DWR Data By Supervisor.xlsx');
}


getGridDataBySupervisor() {
  const gridDataBySupervisor = [];
  const rows = document.getElementsByClassName('single-dwr-grid');
  let currentSupervisor = '';
  let supervisorTotalHours = 0;
  let supervisorTotalWages = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const employee = row.children[0].textContent.trim();
    const date = row.children[1].textContent.trim();
    const supervisor = row.children[10].textContent.trim();
    const hours = parseFloat(row.children[6].textContent.trim());
    const hourlyRate = parseFloat(row.children[7].textContent.trim().replace('$', ''));
    const wages = parseFloat(row.children[8].textContent.trim().replace('$', ''));

    if (currentSupervisor !== supervisor && currentSupervisor !== '') {
      if (supervisorTotalHours !== 0 && supervisorTotalWages !== 0) {
        const supervisorTotalRow = {
          Date: '',
          Supervisor: '',
          Employee: 'Subtotal',
          Hours: supervisorTotalHours,
          'Hourly Rate': '',
          Wages: supervisorTotalWages,
        };
        gridDataBySupervisor.push(supervisorTotalRow);
      }
      supervisorTotalHours = 0;
      supervisorTotalWages = 0;
    }

    if (currentSupervisor !== supervisor) {
      currentSupervisor = supervisor;
    }

    const rowData = {
      Date: date,
      Supervisor: currentSupervisor === supervisor ? supervisor : '',
      Employee: employee,
      Hours: hours,
      'Hourly Rate': hourlyRate,
      Wages: wages,
    };

    gridDataBySupervisor.push(rowData);

    supervisorTotalHours += hours;
    supervisorTotalWages += wages;
  }

  // Add the final supervisor subtotal row
  if (currentSupervisor !== '') {
    if (supervisorTotalHours !== 0 && supervisorTotalWages !== 0) {
      const supervisorTotalRow = {
        Date: '',
        Supervisor: '',
        Employee: 'Subtotal',
        Hours: supervisorTotalHours,
        'Hourly Rate': '',
        Wages: supervisorTotalWages,
      };
      gridDataBySupervisor.push(supervisorTotalRow);
    }
  }

  return gridDataBySupervisor;
}

saveExcelFileBySupervisor(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url: string = window.URL.createObjectURL(data);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}



}



