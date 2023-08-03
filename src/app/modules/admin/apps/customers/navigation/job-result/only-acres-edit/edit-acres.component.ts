import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CustomersService } from '../../../customers.service';

@Component({
    selector: 'app-edit-acres',
    templateUrl: './edit-acres.component.html',
    styleUrls: ['./edit-acres.component.scss'],
})
export class EditAcresInHarvesting implements OnInit {

    //#region Observable
    isLoadingJobAcres$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion
    form: FormGroup;
    routeID;
    farmIdEdit;
    //#region Auto Complete fields
    allFields: Observable<any>;
    field_search$ = new Subject();
    //#endregion

    //#region Auto Complete Farms
    allDestinations: Observable<any>;
    destination_search$ = new Subject();
    //#endregion
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _customerService: CustomersService,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<EditAcresInHarvesting>,
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
            
        });
        if (this.data && this.data.acreData.isEdit) {
            this.form.patchValue({
                id: this.data.acreData.id,
                acres: this.data.acreData.acres,
                customer_id: this.data.acreData.customer_id,
                
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
        // this._customerService.isLoadingJobAcres.next(true);
        // if (this.data && this.data.acreData.isEdit) {
        //     this.form.value.field_id?.field_id ? (this.form.value.field_id = this.form.value.field_id?.field_id) : '';
        //     this.form.value.destinations_id?.name ? this.form.value.destinations_id = this.form.value.destinations_id?.name : '';

        //     this.updateAcresInHarvestJobs(this.form.value);
        // } else {
        //     // this.createCrop(this.form.value);
        // }
    }

    saveAndClose(): void {
        this._customerService.isLoadingJobAcres.next(false);
        this.matDialogRef.close();
    }
    //#endregion

    

}
