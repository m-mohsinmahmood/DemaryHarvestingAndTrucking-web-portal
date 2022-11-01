import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../customers.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-commercial-trucking-rate',
  templateUrl: './add-commercial-trucking-rate.component.html',
  styleUrls: ['./add-commercial-trucking-rate.component.scss']
})
export class AddCommercialTruckingRateComponent implements OnInit {
  
   //#region Observables
   closeDialog$: Observable<boolean>;
   isLoadingTruckingRate$: Observable<boolean>;
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   //#endregion
  
  //#region  Local Variables
  form: FormGroup;
  rateTypes = ['Bushels','Flat','Hours','Hundred Weight','Loaded Miles','Pounds','Tons'];
  //#endregion
 

  constructor( 
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddCommercialTruckingRateComponent>,
    public _customerService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  //#region Lifecycle Functions
  ngOnInit(): void {
    this.initObservables();
    this.initForm();

    // Dialog Close
    this.closeDialog$ = this._customerService.closeDialog$;
    this._customerService.closeDialog$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
    });
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //#endregion
  
  //#region Init Observables 
  initObservables(){
    this.isLoadingTruckingRate$ = this._customerService.isLoadingTruckingRate$      
  }
//#endregion
  //#region Form
  initForm(): void {
    this.form = this._formBuilder.group({
      id: [''],
      customer_id: this.data.customerId,
      rate_type: ['',[Validators.required]],
      rate: ['', [Validators.required]],
  });
    if(this.data && this.data.isEdit){
      const { truckingRate , customerId } = this.data
      this.form.patchValue({
        customer_id: customerId,
        id: truckingRate.id,
        rate_type: truckingRate.rate_type.toString(),
        rate: truckingRate.rate,
      });
    }
  }
  onSubmit(): void {
    this._customerService.isLoadingTruckingRate.next(true);
    this.form.value['crop_id'] = this.form.value['crop_id']?.id;
    if (this.data && this.data.isEdit) {
      this._customerService.updateTruckingRate(this.form.value);
    } else {
      this._customerService.createTruckingRate(this.form.value);
    }
  }

  discard(): void {
    this._customerService.isLoadingTruckingRate.next(false);
    this.matDialogRef.close();
  }
  //#endregion

}
