import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-edit-farming-job',
  templateUrl: './edit-farming-job.component.html',
  styleUrls: ['./edit-farming-job.component.scss']
})
export class EditFarmingJobComponent implements OnInit {

  public form: FormGroup;
  isLoadingEditTruckingInvoice$: Observable<any>
  closeDialog$: Observable<boolean>;

  constructor(
    public matDialogRef: MatDialogRef<EditFarmingJobComponent>,
    private _formBuilder: FormBuilder,
    private api: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _customersService: CustomersService,


  ) { }

  ngOnInit(): void {

    this.initForm();
    this.initObservables();

    this._customersService.closeDialog$.subscribe((res) => {
      if (res) {
        this.matDialogRef.close();
        this._customersService.closeDialog.next(false);
      }
    });

  }

  //#region Init Observables 
  initObservables() {
    this.isLoadingEditTruckingInvoice$ = this._customersService.isLoadingEditTruckingInvoice$
    this.closeDialog$ = this._customersService.closeDialog$;
  }
  //#endregion

  onSubmit(): void {

    if (this.data && this.data.isEdit) {
      this._customersService.updateFarmingJob(this.data.id, 'editFarmingJobResults', this.form.value);

    }
    console.log(this.form.value);
  }


  //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      date: [{ value: '', disabled: true }],
      farm_name: [{ value: '', disabled: true }],
      field_name: [{ value: '', disabled: true }],
      acres: [{ value: '', disabled: true }],
      gps_acres: [{ value: '', disabled: true }],
      service: [{ value: '', disabled: true }],
      start_time: [{ value: '', disabled: true }],
      end_time: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      engine_hours: [{ value: '', disabled: true }],
      equipment_type: [{ value: '', disabled: true }],
      disp_fname: [{ value: '', disabled: true }],
      disp_lname: [{ value: '', disabled: true }],
      beginning_engine_hours: [{ value: '', disabled: true }],
      ending_engine_hours: [{ value: '', disabled: true }],
      hours_worked: [''],
      notes: [{ value: '', disabled: true }],
      acres_completed: [''],
      total_service_acres: [{ value: '', disabled: true }],
      tdriver_fname: [{ value: '', disabled: true }],
      tdriver_lname: [{ value: '', disabled: true }],

      customerId: this.data.customerId,



    });
    if (this.data && this.data.isEdit) {
      const customerId = this.data.customerId;
      const jobData = this.data.jobData;

      console.log(this.data.jobData, "Data")


      this.form.patchValue({
        customer_id: customerId,
        id: jobData.id,
        date: jobData.date,
        farm_name: jobData.farm_name,
        field_name: jobData.field_name,
        acres: jobData.acres,
        gps_acres: jobData.gps_acres,
        service: jobData.service,
        start_time: jobData.start_time,
        end_time: jobData.end_time,
        status: jobData.status,
        engine_hours: jobData.engine_hours,
        equipment_type: jobData.equipment_type,
        disp_fname: jobData.disp_fname,
        disp_lname: jobData.disp_lname,
        beginning_engine_hours: jobData.beginning_engine_hours,
        ending_engine_hours: jobData.ending_engine_hours,
        hours_worked: jobData.hours_worked,
        notes: jobData.notes,
        acres_completed: jobData.acres_completed,
        total_service_acres: jobData.total_service_acres,
        tdriver_fname: jobData.tdriver_fname,
        tdriver_lname: jobData.tdriver_lname,
      });


    }
  }


  discard(): void {
    this.matDialogRef.close();


  }

  saveAndClose(): void {

    // Close the dialog
    this.matDialogRef.close();
  }
}
