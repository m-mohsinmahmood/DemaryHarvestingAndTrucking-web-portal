import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
        @Inject(MAT_DIALOG_DATA) public data: any
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
        console.warn('Your order has been submitted', this.form.value);
        this.form.reset();
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
}
