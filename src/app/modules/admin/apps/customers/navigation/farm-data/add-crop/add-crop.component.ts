/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';

interface Calender {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-add-crop',
    templateUrl: './add-crop.component.html',
    styleUrls: ['./add-crop.component.scss'],
})
export class AddCropComponent implements OnInit {
    selectedValue: string;
    form: FormGroup;

    calenderYear: Calender[] = [
        { value: '22', viewValue: '2022' },
        { value: '21', viewValue: '2021' },
        { value: '20', viewValue: '2020' },
        { value: '19', viewValue: '2019' },
        { value: '18', viewValue: '2018' },
        { value: '17', viewValue: '2017' },
    ];

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _customerService: CustomersService,

    ) {}

    ngOnInit(): void {
        // Create the form
        this.form = this._formBuilder.group({
            cropName: ['', [Validators.required]],
            status: ['', [Validators.required]],
            calenderYear: ['', [Validators.required]],
        });
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                cropName: this.data.cropName,
                calenderYear: this.data.calenderYear,
            });
        }
    }

    onSubmit(): void {
        // console.warn('Your order has been submitted', this.form.value);
        // this.form.reset();
        console.log('Mat-Data',this.data);
        // const a ={
        //     id: 'ea384f4a-10d5-4042-927b-8b2edf2be3ab',
        //     customer_id: this.data?.farmdata?.customer_id,
        //     farm_id: this.data?.farmdata?.farmId,
        //     name: this.form.value.name,
        //     calendar_year: '2022/10/10',
        // };
        const b ={
            customer_id: this.data.customer_id,
            farm_id: '7485bb10-f0d4-4535-acf1-8f70445d967c',
            crop_id: '2aed9f4a-37ca-45c4-80d1-0c069a6b6fd6',
            calendar_year: '2020/10/10',
        };
        // console.log('Payload Data:',a);
        console.log('Payload Data:',b);

        if (this.data?.farmdata && this.data?.isEdit) {

            // this.updateDestination(a);
        } else {
            this.createCrop(b);
        }
    }
    createCrop(data){
       this._customerService.createCustomerCrops(data);
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
}
