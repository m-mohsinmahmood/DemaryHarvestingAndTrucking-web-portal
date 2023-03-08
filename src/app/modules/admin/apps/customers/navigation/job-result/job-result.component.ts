import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { number } from 'joi';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { CustomersService } from '../../customers.service';
import { customerFilters } from '../../customers.types';
import { Customers } from '../../customers.types';
import { EditTruckingJobComponent } from './edit-trucking-job/edit-trucking-job.component';
import { EditFarmingJobComponent } from './edit-farming-job/edit-farming-job.component';

@Component({
  selector: 'app-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {
  panelOpenState = false;
  jobsFiltersForm: FormGroup;
  truckingFiltersForm: FormGroup;
  farmingFiltersForm: FormGroup;

  //#region Auto Complete Farms
  allFarms: Observable<any>;
  farm_search$ = new Subject();
  //#endregion

  //#region Auto Complete Farms
  allCrops: Observable<any>;
  crop_search$ = new Subject();
  //#endregion


  //#region Observable
  customFarmingJobs$: any;
  customHarvestingJobs$: any;
  commercialTruckingJobs$: any;
  formValid: boolean;

  harvestingFilterBool: boolean = false;
  truckingFilterBool: boolean = false;
  farmingFilterBool: boolean = false;

  routeID; // URL ID



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion


  constructor(
    private _formBuilder: FormBuilder,
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog,



  ) { }

  ngOnInit(): void {
    this.getRouteParams();
    this.initObservables();
    this.initFiltersForm();
    this.initApis();
    this.farmSearchSubscription();
    this.cropSearchSubscription();

  }

  //#region Init Observables
  initObservables() {
    this.customFarmingJobs$ = this._customerService.customFarmingJobs;
    this.customHarvestingJobs$ = this._customerService.customHarvestingJobs;
    this.commercialTruckingJobs$ = this._customerService.commercialTruckingJobs;


  }

  //#endregion


  getDropdownFarms() {
    let value = this.jobsFiltersForm.controls['farm_id'].value;
    this.allFarms = this._customerService.getDropdownCustomerFarms(
      this.routeID,
      value != null ? value : ''
    );
  }

  //Auto Complete Farms Display Function
  displayFarmForAutoComplete(farm: any) {
    return farm ? `${farm.name}` : undefined;
  }
  //Search Function
  farmSearchSubscription() {
    this.farm_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allFarms = this._customerService.getDropdownCustomerFarms(
          this.routeID,
          value
        );
      });
  }
  //#endregion

  //#region Auto Complete Crops Display Function
  getDropdownCrops() {
    let value;
    typeof this.jobsFiltersForm.controls['crop_id'].value === 'object' ? (value = this.jobsFiltersForm.controls['crop_id'].value.name) : (value = this.jobsFiltersForm.controls['crop_id'].value);
    this.allCrops = this._customerService.getDropdownCustomerCropsAll(value);
}

  displayCropForAutoComplete(crop: any) {
    return crop ? `${crop.name}` : undefined;
  }
  //#endregion

  //#region Search Function
  cropSearchSubscription() {
    this.crop_search$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((value: string) => {
        this.allCrops = this._customerService.getDropdownCustomerCropsAll(
          value
        );
      });
  }
  //#endregion

  //#region Init Apis on Tabs
  initApis() {
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
    console.log(this.customHarvestingJobs$);
  }

  initFiltersForm() {
    this.jobsFiltersForm = this._formBuilder.group({
      farm_id: [''],
      destinations: [''],
      crop_id: [''],
    });

    this.truckingFiltersForm = this._formBuilder.group({
      
      from: [''],
      to: [''],
      //created_at: [''],
  });

  this.farmingFiltersForm = this._formBuilder.group({
    service_type: [''],
    quantity_type: [''],
    from: [''],
    to: [''],
});


  }
  
  applyFilters() {
    !this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '';
    !this.jobsFiltersForm.value.destinations ? (this.jobsFiltersForm.value.destinations = '') : ('');
    !this.jobsFiltersForm.value.crop_id?.id ? (this.jobsFiltersForm.value.crop_id = this.jobsFiltersForm.value.crop_id?.id) : '';
    this.harvestingFilterBool = true;
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
  }

  removeFilters() {
    this.jobsFiltersForm.reset();
    this.jobsFiltersForm.value.farm_id = '';
    this.jobsFiltersForm.value.destinations = '';
    this.jobsFiltersForm.value.crop_id = '';
    this.harvestingFilterBool = false;
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);

  }

  async applyTruckingFilters() {
    !this.truckingFiltersForm.value.from ? (this.truckingFiltersForm.value.from = '') : ('');
    !this.truckingFiltersForm.value.to ? (this.truckingFiltersForm.value.to = '') : ('');
    this.truckingFiltersForm.value.from ? this.truckingFiltersForm.controls['from'].setValue(moment(this.truckingFiltersForm.value.from).format('YYYY-MM-DD')) : ('');
    this.truckingFiltersForm.value.to ? this.truckingFiltersForm.controls['to']?.setValue(moment(this.truckingFiltersForm.value.to).format('YYYY-MM-DD')) : ('');
    this.truckingFilterBool = true;
    this._customerService.getTruckingJobs(this.routeID, 'trucking', this.truckingFiltersForm.value);

}

async removeTruckingFilters() {
    this.truckingFiltersForm.reset();
    this.truckingFiltersForm.value.from = '';
    this.truckingFiltersForm.value.to = '';
    this.truckingFilterBool = false;
    this._customerService.getTruckingJobs(this.routeID, 'trucking', this.truckingFiltersForm.value);


}
async applyFarmingFilters() {
  !this.farmingFiltersForm.value.service_type ? (this.farmingFiltersForm.value.service_type = '') : ('');
  !this.farmingFiltersForm.value.quantity_type ? (this.farmingFiltersForm.value.quantity_type = '') : ('');
  !this.farmingFiltersForm.value.from ? (this.farmingFiltersForm.value.from = '') : ('');
  !this.farmingFiltersForm.value.to ? (this.farmingFiltersForm.value.to = '') : ('');
  this.farmingFiltersForm.value.from ? this.farmingFiltersForm.controls['from'].setValue(moment(this.farmingFiltersForm.value.from).format('YYYY-MM-DD')) : ('');
  this.farmingFiltersForm.value.to ? this.farmingFiltersForm.controls['to']?.setValue(moment(this.farmingFiltersForm.value.to).format('YYYY-MM-DD')) : ('');
  this.farmingFilterBool = true;
  this._customerService.getFarmingJobs(this.routeID, 'farming', this.farmingFiltersForm.value);

}

async removeFarmingFilters() {
  this.farmingFiltersForm.reset();
  this.farmingFiltersForm.value.service_type = '';
  this.farmingFiltersForm.controls['quantity_type'].setValue('');
  this.farmingFiltersForm.value.from = '';
  this.farmingFiltersForm.value.to = '';
  this.farmingFilterBool = false ;
  this._customerService.getFarmingJobs(this.routeID, 'farming', this.farmingFiltersForm.value);



}



  getRelativeTabJobs(index: number) {
    if (index == 0) {
      this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
      console.log(this.customHarvestingJobs$);
    }
    else if (index == 1) {
      this._customerService.getTruckingJobs(this.routeID, 'trucking');
      console.log(this.commercialTruckingJobs$);
    }
    else if (index == 2) {
      this._customerService.getFarmingJobs(this.routeID, 'farming');
      console.log(this.customFarmingJobs$);
    }
    else {
      this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
      this._customerService.getTruckingJobs(this.routeID, 'trucking');
      this._customerService.getFarmingJobs(this.routeID, 'farming');
    }
  }

  //#endregion

  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion
  //#region Validation
  formValidation(e) {
    typeof (e) == 'string' ? (this.formValid = true) : (this.formValid = false)
}
//#endregion

//#region edit job

editTruckingJob(data: any, id:any)
{
  const dialogRef = this._matDialog.open(EditTruckingJobComponent, {
    data: {
        isEdit: true,
        customerId: this.routeID,
        jobId: id,
        jobData: data,
    },
});
dialogRef.afterClosed().subscribe((result) => {});
}

editFarmingJob(data: any, id:any)
{
  const dialogRef = this._matDialog.open(EditFarmingJobComponent, {
    data: {
        isEdit: true,
        customerId: this.routeID,
        jobId: id,
        jobData: data,
    },
});
dialogRef.afterClosed().subscribe((result) => {});
}

}


