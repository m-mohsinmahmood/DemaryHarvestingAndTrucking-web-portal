import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Observable } from 'rxjs';
import { MachineryService } from '../../../machinery.service';
import { Machineries } from '../../../machinery.types';

@Component({
  selector: 'app-edit-main-repair',
  templateUrl: './edit-main-repair.component.html',
  styleUrls: ['./edit-main-repair.component.scss']
})
export class EditMainRepair implements OnInit {

  public form: FormGroup;
  isLoadingEditTruckingInvoice$: Observable<any>
  closeDialog$: Observable<boolean>;
  isLoadingMaintenanceRepair$: Observable<boolean>;
  maintenanceRepairTicket$: Observable<Machineries[]>;
  arr: any;




  constructor(
    public matDialogRef: MatDialogRef<EditMainRepair>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _machineryService: MachineryService,



  ) { }

  ngOnInit(): void {
    this.initObservables();
    this.initApis()

    setTimeout(() => {
      this._machineryService.maintenanceRepairTicket$
        .subscribe((item) => {
          this.arr = item;
          console.log(this.arr, "item");
          this.initForm();

        });
    }, 500);



  }

  initApis() {
    this._machineryService.getMainRepairTicketById(this.data.id);
  }

  //#region Init Observables 
  initObservables() {
    this.isLoadingMaintenanceRepair$ = this._machineryService.isLoadingMaintenanceRepair$;
    this.maintenanceRepairTicket$ = this._machineryService.maintenanceRepairTicket$;

  }
  //#endregion

  onSubmit(): void {


  }


  //#region Form
  initForm() {
    // Create the form
    this.form = this._formBuilder.group({
      id: [''],
      repairTicketId: [{ value: '', disabled: true }],
      assignedById: [{ value: '', disabled: true }],
      assignedToId: [{ value: '', disabled: true }],
      equipmentId: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      issueCategory: [{ value: '', disabled: true }],
      severityType: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      summary: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      ticketType: [{ value: '', disabled: true }],
      empId: [{ value: '', disabled: true }]

    });
    if (this.data.isEdit) {
      this.form.patchValue({
        id: this.arr.id,
        repairTicketId: this.arr.repairTicketId,
        assignedById: this.arr.assignedById,
        assignedToId: this.arr.assignedToId,
        equipmentId: this.arr.equipmentId,
        city: this.arr.city,
        state: this.arr.state,
        issueCategory: this.arr.issueCategory,
        severityType: this.arr.severityType,
        status: this.arr.status,
        summary: this.arr.summary,
        description: this.arr.description,
        ticketType: this.arr.ticketType,
        empId: this.arr.empId
      });


    }
  }


  discard(): void {
    this.matDialogRef.close();
  }

  saveAndClose(): void {
    this.matDialogRef.close();
  }
}
