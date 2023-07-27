import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CustomersService } from '../../../customers.service';

@Component({
    selector: 'app-edit-acres-harvesting-jobs',
    templateUrl: './edit-acres-harvesting-jobs.component.html',
    styleUrls: ['./edit-acres-harvesting-jobs.component.scss'],
})
export class AcresHarvestingJobs implements OnInit {

    //#region Observable
    isLoadingJobAcres$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion
    form: FormGroup;


    constructor(
        private _customerService: CustomersService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<AcresHarvestingJobs>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    //#region Lifecycle Functions
    ngOnInit(): void {
        this.initObservables();
        this.initForm()
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });

    }
    //#endregion

    //#region Init Observables
    initObservables() {
        this.isLoadingJobAcres$ = this._customerService.isLoadingJobAcres$;
        this.closeDialog$ = this._customerService.closeDialog$;
    }

    //#endregion

    //#region Form
    initForm() {
        // Create the form
        this.form = this._formBuilder.group({
            id: [''],
            acres: [''],
            customer_id: [''],
            load_date: [''],
            delivery_ticket: [''],
            sl_number: [''],
            net_pounds: [''],
            net_bushel: [''],
            load_miles: [''],
            status: [''],
            crop_id:['']
        });
        if (this.data && this.data.acreData.isEdit) {
            console.log(this.data)
            this.form.patchValue({
                id: this.data.acreData.id,
                acres: this.data.acreData.acres,
                customer_id: this.data.acreData.customer_id,
                load_date: this.data.acreData.load_date,
                delivery_ticket: this.data.acreData.delivery_ticket,
                sl_number: this.data.acreData.sl_number,
                net_pounds: this.data.acreData.net_pounds,
                net_bushel: this.data.acreData.net_bushel,
                load_miles: this.data.acreData.load_miles,
                status: this.data.acreData.status,
                crop_id: this.data.acreData.crop_id,
            });
        }
    }

    // createCrop(cropData: any): void {
    //     this._h2aRatesService.createCrop(cropData);
    // }
    updateAcresInHarvestJobs(acreData: any): void {
        this._customerService.updateAcresInHarvestJobs(acreData, 'updateAcres');
    }

    onSubmit(): void {
        this._customerService.isLoadingJobAcres.next(true);
        if (this.data && this.data.acreData.isEdit) {
            this.updateAcresInHarvestJobs(this.form.value);
        } else {
            // this.createCrop(this.form.value);
        }
    }

    saveAndClose(): void {
        this._customerService.isLoadingJobAcres.next(false);
        this.matDialogRef.close();
    }
    //#endregion

}
