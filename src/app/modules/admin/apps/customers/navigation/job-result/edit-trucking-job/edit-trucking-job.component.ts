import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddCustomer } from '../../../add/add.component';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'app-edit-trucking-job',
  templateUrl: './edit-trucking-job.component.html',
  styleUrls: ['./edit-trucking-job.component.scss']
})
export class EditTruckingJobComponent implements OnInit {

  public form: FormGroup;
  isLoadingEditTruckingInvoice$: Observable<any>
  closeDialog$: Observable<boolean>;

  constructor(
    public matDialogRef: MatDialogRef<EditTruckingJobComponent>,
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
      this._customersService.updateTruckingJob(this.data.id, 'editTruckingJobResults', this.form.value);

    }
    console.log(this.form.value);
  }


  //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      load_date: [{ value: '', disabled: true }],
      dispatcher_fname: [{ value: '', disabled: true }],
      dispatcher_lname: [{ value: '', disabled: true }],
      driver_fname: [{ value: '', disabled: true }],
      driver_lname: [{ value: '', disabled: true }],
      cargo: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      customer_name: [{ value: '', disabled: true }],
      dispatcher_notes: [{ value: '', disabled: true }],
      rate: [{ value: '', disabled: true }],
      truck_name: [{ value: '', disabled: true }],
      total_job_miles: [''],
      total_trip_miles: [{ value: '', disabled: true }],
      truck_driver_notes: [{ value: '', disabled: true }],
      weightLoad: [''],
      scaleTicket: [{ value: '', disabled: true }],
      hours_worked: [''],
      crop_name: [{ value: '', disabled: true }],
      customerId: this.data.customerId,




    });
    if (this.data && this.data.isEdit) {
      const customerId = this.data.customerId;
      const jobData = this.data.jobData;

      console.log(this.data.jobData, "Data")


      this.form.patchValue({
        customer_id: customerId,
        id: jobData.id,
        load_date: jobData.load_date,
        dispatcher_fname: jobData.disp_first_name,
        dispatcher_lname: jobData.disp_last_name,
        driver_fname: jobData.dr_first_name,
        driver_lname: jobData.dr_last_name,
        cargo: jobData.cargo,
        city: jobData.dest_city,
        state: jobData.destination_state,
        status: jobData.status,
        customer_name: jobData.customer_name,
        dispatcher_notes: jobData.dispatcher_notes,
        rate: jobData.rate,
        truck_name: jobData.truck_name,
        total_job_miles: jobData.total_job_miles,
        total_trip_miles: jobData.total_trip_miles,
        truck_driver_notes: jobData.truck_driver_notes,
        weightLoad: jobData.weightLoad,
        scaleTicket: jobData.scaleTicket,
        hours_worked: jobData.hours_worked,
        crop_name: jobData.crop_name,
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
