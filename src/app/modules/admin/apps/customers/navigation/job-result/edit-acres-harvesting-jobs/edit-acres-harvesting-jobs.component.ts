import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
        this.routeID = this.data.acreData.routeID;
        this.farmIdEdit = this.data.acreData.farm_id;
        this.fieldSearchSubscription();
        this.destinationsSearchSubscription();
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
            crop_id: [''],
            ticket_name: [''],
            destinations_id: [''],
            field_name: [this.data.acreData.field_name],
            field_id: [''],
            farm_id: [''],
        });
        if (this.data && this.data.acreData.isEdit) {
            console.log(this.data.acreData)
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
                ticket_name: this.data.acreData.ticket_name,
                field_id: this.data.acreData.field,
                farm_id: this.data.acreData.farm_id,
                destinations_id: this.data.acreData.destination
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
            this.form.value.field_id?.field_id ? (this.form.value.field_id = this.form.value.field_id?.field_id) : '';
            this.form.value.destinations_id?.name ? this.form.value.destinations_id = this.form.value.destinations_id?.name : '';

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

    //#region fields autocomplete
    getDropdownFields() {
        let value = this.form.controls['field_id'].value;
        this.allFields = this._customerService.getDropdownCustomerFields(
            this.routeID,
            this.farmIdEdit,
            value != null ? value : ''
        );

    }

    //Auto Complete Farms Display Function
    displayFieldForAutoComplete(field: any) {
        return field ? `${field.field_name}` : undefined;
    }
    //Search Function
    fieldSearchSubscription() {
        this.field_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allFields = this._customerService.getDropdownCustomerFields(
                    this.routeID,
                    this.farmIdEdit,
                    value
                );
            });
    }
    //#endregion

    //#region destinations autocomplete
    getDropdownDestinations() {
        let value = this.form.controls['destinations_id'].value;
        this.allDestinations = this._customerService.getDropdownCustomerDestinations(
            this.routeID,
            this.farmIdEdit,
            value != null ? value : ''
        );
    }

    //Auto Complete Farms Display Function
    displayDestinationsForAutoComplete(destination: any) {
        return destination ? `${destination.destination_name}` : undefined;
    }
    //Search Function
    destinationsSearchSubscription() {
        this.destination_search$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value: string) => {
                this.allDestinations = this._customerService.getDropdownCustomerDestinations(
                    this.routeID,
                    this.farmIdEdit,
                    value
                );
            });
    }
    //#endregion


}
