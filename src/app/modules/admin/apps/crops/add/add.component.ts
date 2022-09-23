import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCropsComponent implements OnInit {
    form: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            crop: [''],
            variety: [''],
            bushelWeight: ['', [Validators.required]],
        });
        // Create the form
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                crop: this.data.cropName,
                variety: this.data.variety,
                bushelWeight: this.data.bushelWeight,
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
