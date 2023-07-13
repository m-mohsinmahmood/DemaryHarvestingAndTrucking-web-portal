import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { debounceTime, Observable } from 'rxjs';
import { EmployeeService } from '../../../employee.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-periodic-payroll-details',
  templateUrl: './periodic-payroll-details.component.html',
  styleUrls: ['./periodic-payroll-details.component.scss']
})
export class PeriodicPayrollDetails implements OnInit {

  public form: FormGroup;
  closeDialog$: Observable<boolean>;
  payrollPeriodDetails$: Observable<any>;
  isLoadingPayrollPeriodDetails$: Observable<boolean>;
  arr: any;
  routeID; // URL ID
  totalWages: number;
  totalHours: number;





  constructor(
    public matDialogRef: MatDialogRef<PeriodicPayrollDetails>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _employeeService: EmployeeService,
    public activatedRoute: ActivatedRoute,





  ) { }

  ngOnInit(): void {
    this.initObservables();
    this.initForm();
    this.initApis();

    console.log(this.payrollPeriodDetails$)
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


  calculateTotalSingleWages(): number {
    this.totalWages = 0; // Reset the total wages
    this.payrollPeriodDetails$.subscribe(data => {
      for (const dwr of data?.dwrsDetailed) {
        if(dwr.wage)
          this.totalWages += parseFloat(dwr.wage);

      }

    });

    return this.toDecimalPoint(this.totalWages.toFixed(2));
  }

  calculateTotalHoursSingleDwr(): number {
    this.totalHours = 0; // Reset the total wages
    this.payrollPeriodDetails$.subscribe(data => {
      for (const dwr of data?.dwrsDetailed) {
        if(dwr.hours_worked)
        {
          this.totalHours += parseFloat(dwr?.hours_worked);

        }
      }

    });

    return this.totalHours;
  }

  toDecimalPoint(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  
  exportToExcel(): void {
    const wb = XLSX.utils.book_new();
  
    this.payrollPeriodDetails$.subscribe((data) => {
      const employeeName = `${data.first_name}_${data.last_name}`;
  
      const exportData =  [];

      const headerRow = [
        'Date', 'Supervisor', 'State', 'Hours', 'Hourly Rate', 'Wage'

      ];
      exportData.push(headerRow);

      // Prepare data for export
      data.dwrsDetailed.map((dwr) => {
        const row = [
          dwr.created_at,
          dwr.supervisor,
          dwr.state,
          dwr.hours_worked,
          dwr.hourly_rate,
          dwr.wage
        ];
        exportData.push(row);
      });
  
      // Calculate total hours and total wages
      const totalHours = this.calculateTotalHoursSingleDwr().toFixed(2);
      const totalWages = this.calculateTotalSingleWages();
  
      // Add totals row
      const totalsRow = ['', '', '', "Total Hours: " + totalHours, '', "Total Wages: " + totalWages];
      exportData.push(totalsRow);
  
      // Create the worksheet
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      const wsName = 'DWR Data';
  
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, wsName);
  
      // Generate the Excel file and save it
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const date = new Date().toISOString().slice(0, 10);
      const filename = `Dwr_Detailed_Data_${employeeName}_${date}.xlsx`;
      const file = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(file, filename);
    });
  }
}
