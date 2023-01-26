import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { H2aRatesService } from '../h2a-rates.services';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditH2aRatesComponent implements OnInit {

    //#region Observable
    isLoadingH2aRate$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion
    form: FormGroup;


    constructor(
        private _h2aRatesService: H2aRatesService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<EditH2aRatesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initObservables();
        this.initForm()
        this._h2aRatesService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._h2aRatesService.closeDialog.next(false);
            }
        });

    }
    //#endregion

    //#region Init Observables
    initObservables() {
        this.isLoadingH2aRate$ = this._h2aRatesService.is_loading_h2aRate$;
        this.closeDialog$ = this._h2aRatesService.closeDialog$;
    }

    //#endregion

    //#region Form
    initForm(){
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            state: [{ value: '', disabled: true },],
            hourly_rate: [''],
        });
        if (this.data && this.data.rateData.isEdit) {
            this.form.patchValue({
                id: this.data.rateData.id,
                state: this.data.rateData.state,
                hourly_rate: this.data.rateData.hourly_rate,
            });
        }
    }

    // createCrop(cropData: any): void {
    //     this._h2aRatesService.createCrop(cropData);
    // }
    updateH2aRate(rateData: any): void {
        this._h2aRatesService.updateH2aRate(rateData);
    }

    onSubmit(): void {
        this._h2aRatesService.is_loading_h2aRate.next(true);
        if (this.data && this.data.rateData.isEdit) {
            this.updateH2aRate(this.form.value);
        } else {
            // this.createCrop(this.form.value);
        }
    }

    saveAndClose(): void {
        this._h2aRatesService.is_loading_h2aRate.next(false);
        this.matDialogRef.close();
    }
    //#endregion

}
