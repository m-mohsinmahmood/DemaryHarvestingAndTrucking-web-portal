import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CropService } from '../crops.services';


@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCropsComponent implements OnInit {
    form: FormGroup;

    constructor(
        private _cropsService: CropService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            id: [''],
            name: [''],
            category: [''],
            bushel_weight: ['', [Validators.required]],
        });
        // Create the form
        if (this.data && this.data.isEdit) {
            this.form.patchValue({
                id: this.data.id,
                name: this.data.name,
                category: this.data.category,
                bushel_weight: this.data.bushel_weight,
            });
        }
    }

    createCrop(data: any): void {
        this._cropsService.createCrop(data);
    }
    updateCrop(data: any): void{
        this._cropsService.updateCrop(data);
    }

    onSubmit(): void {
    if (this.data && this.data.isEdit){
        this.updateCrop(this.form.value);
        this.matDialogRef.close();

    }
    else {
        this.createCrop(this.form.value);
        this.matDialogRef.close();
    }
        console.warn('Your order has been submitted', this.form.value);
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
}
