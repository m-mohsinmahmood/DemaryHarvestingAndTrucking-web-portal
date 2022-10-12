import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';

interface Calender {
    value: string;
    viewValue: string;
  }

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.component.html',
  styleUrls: ['./add-farm.component.scss']
})
export class AddFarmComponent implements OnInit {

  selectedValue: string;
  form: FormGroup;

  calenderYear: Calender[] = [
    {value: '22', viewValue: '2022'},
    {value: '21', viewValue: '2021'},
    {value: '20', viewValue: '2020'},
    {value: '19', viewValue: '2019'},
    {value: '18', viewValue: '2018'},
    {value: '17', viewValue: '2017'},
  ];


  constructor(
    private _formBuilder: FormBuilder,
    private _customersService: CustomersService,
    public matDialogRef: MatDialogRef<AddFarmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this._customersService.closeDialog$.subscribe((res) => {
        if (res) {
            this.matDialogRef.close();
            this._customersService.closeDialog.next(false);
        }
    });
    // Create the form
    this.form = this._formBuilder.group({
        farm_id : [''],
        customer_id : this.data.id,
        name     : ['', [Validators.required]],
        acres    : ['', [Validators.required]],
        calendar_year: ['', [Validators.required]],
      });
      if (this.data && this.data.isEdit) {
        this.form.patchValue({
            id: this.data.field_id,
            farm_id : this.data.farm_id,
            // farm_name : this.data.farm_name,
            customer_id : this.data.customer_id,
            name     :  this.data.field_name,
            acres    : this.data.acres,
            calendar_year: this.data.calendar_year,
        });
    }
  }

  onSubmit(): void {
    this._customersService.isLoadingCustomerField.next(true);
    this.createCustomerField(this.form.value);
    // if (this.data && this.data.cropData.isEdit) {
    //     this.updateCrop(this.form.value);
    // } else {

    // }
  }

  createCustomerField(customerFieldData: any): void {
    this._customersService.createCustomerField(customerFieldData);
}

saveAndClose(): void {
    this._customersService.isLoadingCustomerField.next(false);
    this.matDialogRef.close();
}



  discard(): void
  {
    this.matDialogRef.close();
  }


}
