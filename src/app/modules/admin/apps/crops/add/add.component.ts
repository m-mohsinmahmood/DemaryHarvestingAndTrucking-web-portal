/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { CropService } from '../crops.services';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCropsComponent implements OnInit {
    isLoadingCrop: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoadingCrop$: Observable<boolean> = this.isLoadingCrop.asObservable();

    form: FormGroup;

    constructor(
        private _cropsService: CropService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.isLoadingCrop$ = this._cropsService.is_loading_crop$;
        this.form = this._formBuilder.group({
            id: [''],
            name: [''],
            category: [''],
            bushel_weight: ['', [Validators.required]],
        });
        // Create the form
        if (this.data && this.data.cropData.isEdit) {
            this.form.patchValue({
                id: this.data.cropData.id,
                name: this.data.cropData.name,
                category: this.data.cropData.category,
                bushel_weight: this.data.cropData.bushel_weight,
            });
        }
    }

    createCrop(cropData: any): void {
        this._cropsService.createCrop(cropData);
    }
    updateCrop(cropData: any): void {
        this._cropsService.updateCrop(cropData, this.data.paginationData);
    }

    onSubmit(): void {
        this.isLoadingCrop.next(true);
        if (this.data && this.data.cropData.isEdit) {
            this.updateCrop(this.form.value);
            this.matDialogRef.close();
        } else {
            this.createCrop(this.form.value);
            this.matDialogRef.close();
        }
    }

    saveAndClose(): void {
        this.matDialogRef.close();
    }

    discard(): void {
        this.matDialogRef.close();
    }
}
