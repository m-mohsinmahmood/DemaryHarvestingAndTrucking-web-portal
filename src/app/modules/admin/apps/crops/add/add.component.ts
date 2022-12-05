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

    //#region Observable
    isLoadingCrop$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion
    form: FormGroup;

    constructor(
        private _cropsService: CropService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AddCropsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initObservables();
        this.initForm()
        this._cropsService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._cropsService.closeDialog.next(false);
            }
        });
    }
    //#endregion

    //#region Init Observables
    initObservables() {
        this.isLoadingCrop$ = this._cropsService.is_loading_crop$;
        this.closeDialog$ = this._cropsService.closeDialog$;
    }

    //#endregion

    //#region Form
    initForm(){
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            name: ['',[Validators.required]],
            variety: [''],
            bushel_weight: [, [Validators.required]],
        });
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
        this._cropsService.updateCrop(cropData);
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
    //#endregion

}
