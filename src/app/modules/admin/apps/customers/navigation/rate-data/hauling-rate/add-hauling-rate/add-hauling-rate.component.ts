import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from '../../../../customers.service';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-add-hauling-rate',
  templateUrl: './add-hauling-rate.component.html',
  styleUrls: ['./add-hauling-rate.component.scss']
})
export class AddHaulingRateComponent implements OnInit {

  //#region  Local Variables
  form: FormGroup;
  rateTypes = ['Bushels','Hundred Weight','Miles','Tons','Ton Miles'];

  //#endregion

  //#region Observables
  closeDialog$: Observable<boolean>;
  isLoadingHaulingRate$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddHaulingRateComponent>,
    public _customerService: CustomersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

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
  this.isLoadingHaulingRate$ = this._customerService.isLoadingHaulingRate$      
}
//#endregion

  //#region Form
  initForm(): void {
    this.form = this._formBuilder.group({
      id: [''],
      customer_id: this.data.customer_id,
      rate_type: ['',[Validators.required]],
      rate: [''],
      base_rate: [''],
      premium_rate: [''],
  });
    if(this.data && this.data.isEdit){
      const { customer_id , haulingRate } = this.data;
      this.form.patchValue({
        customer_id: customer_id,
        id: haulingRate.id,
        rate_type: haulingRate.rate_type.toString(),
        rate: haulingRate.rate,
        base_rate: haulingRate.base_rate,
        premium_rate: haulingRate.premium_rate,
      });
    }
  }
onSubmit(): void {
  this._customerService.isLoadingHaulingRate.next(true);
  if (this.data && this.data.isEdit) {
    if (this.form.value.rate_type != 'Ton Miles'){
      this.form.value.base_rate = 0;
      this.form.value.premium_rate = 0;
    }
    if(this.form.value.rate_type == 'Ton Miles'){
      this.form.value.rate = 0;
    }
    this._customerService.updateHaulingRate(this.form.value);
  } else{
    this._customerService.createHaulingRate(this.form.value);
  }
  this.form.reset();
}

discard(): void {
  this._customerService.isLoadingHaulingRate.next(false);
  this.matDialogRef.close();
}
//#endregion

}
