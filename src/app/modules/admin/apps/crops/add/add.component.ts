/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Subscription } from 'rxjs';
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CropService } from '../crops.services';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCropsComponent implements OnInit {
    isLoadingCrop$: Observable<boolean>;
    closeDialog$: Observable<boolean>;

    form: FormGroup;

    constructor(
        private _cropsService: CropService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.isLoadingCrop$ = this._cropsService.is_loading_crop$;
        this.closeDialog$ = this._cropsService.closeDialog$;
        this._cropsService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._cropsService.closeDialog.next(false);
            }
        });
        this.form = this._formBuilder.group({
            id: [''],
            name: [''],
            variety: [''],
            bushel_weight: ['', [Validators.required]],
        });
        // Create the form
        if (this.data && this.data.cropData.isEdit) {
            this.form.patchValue({
                id: this.data.cropData.id,
                name: this.data.cropData.name,
                variety: this.data.cropData.variety,
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
        this._cropsService.is_loading_crop.next(true);
        if (this.data && this.data.cropData.isEdit) {
            this.updateCrop(this.form.value);
        } else {
            this.createCrop(this.form.value);
        }
    }

    saveAndClose(): void {
        this._cropsService.is_loading_crop.next(false);
        this.matDialogRef.close();
    }

}
