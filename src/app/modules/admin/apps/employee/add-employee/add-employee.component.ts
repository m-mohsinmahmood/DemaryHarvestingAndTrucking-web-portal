import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
    @Inject(MAT_DIALOG_DATA) public data: any

    isLoadingEmployee$: Observable<boolean>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public form: FormGroup;
    closeDialog$: Observable<boolean>;

    constructor(private _employeeService: EmployeeService,
        public matDialogRef: MatDialogRef<AddEmployeeComponent>,
        private _formBuilder: FormBuilder,

    ) { }

    ngOnInit(): void {
        this.initObservables();
        this.initForm();

        this._employeeService.closeDialog$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._employeeService.closeDialog.next(false);
            }
        });

        console.log(this.data);

    }

    initObservables() {
        this.isLoadingEmployee$ = this._employeeService.isLoadingAddEmployee$;
        this.closeDialog$ = this._employeeService.closeDialog$;
    }

    initForm() {
        // Create the form
        this.form = this._formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            employee_role: ['', [Validators.required]],
            employee_company: ['', [Validators.required]],
            machinery: ['', [Validators.required]],
            operation: ['addGuestEmployee']
        });
    }

    onSubmit(): void {
        this._employeeService.isLoadingAddEmployee.next(true);
        this._employeeService.addNewGuestEmployee(this.form.value);
    }

    discard(): void {
        this._employeeService.isLoadingAddEmployee.next(false);
        this.matDialogRef.close();
    }

}
