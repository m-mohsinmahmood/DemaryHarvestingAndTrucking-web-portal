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
import { Observable } from 'rxjs';
import moment from 'moment';

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
    page: number = 1;
    pageSize = 200;
    pageSizeOptions: number[] = [50, 100, 150, 200, 250, 300, 350, 500];
    dwrFiltersForm: FormGroup;
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
        console.log(this.allDwrsList$);
    }

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

    //#region Filters
    applyFilters() {
        debugger
        if (this.dwrFiltersForm.get('ending_date').value !== null) {
            if (this.dwrFiltersForm.value.beginning_date) {
              this.dwrFiltersForm.controls['beginning_date'].patchValue(moment(this.dwrFiltersForm.value.beginning_date).format('YYYY-MM-DD'));
            }
            if (this.dwrFiltersForm.value.ending_date) {
              this.dwrFiltersForm.controls['ending_date'].patchValue(moment(this.dwrFiltersForm.value.ending_date).format('YYYY-MM-DD'));
            }
      
            this._employeeService.getDwrList('dwrList', this.dwrFiltersForm.value);
        }

        this.initApis();
    }

    removeFilters() {
        this.dwrFiltersForm.reset();
        this.initApis();
    }

    initFiltersForm() {
        this.dwrFiltersForm = this._formBuilder.group({
            name: [''],
            beginning_date: [''],
            ending_date: [''],
            category: [''],
            supervisor_name: [''],
        });
    }

    totalWage(hours_worked: any, arizona_rate:any, max_rate:any, state:any ) {
        if (arizona_rate && max_rate) {
          if(state== 'Arizona')
          {
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
    //#endregion
}



