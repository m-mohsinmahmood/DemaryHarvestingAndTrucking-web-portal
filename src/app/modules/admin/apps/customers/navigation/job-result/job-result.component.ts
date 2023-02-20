import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { number } from 'joi';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { CustomersService } from '../../customers.service';
import { customerFilters } from '../../customers.types';
import { Customers } from '../../customers.types';

@Component({
  selector: 'app-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {
  panelOpenState = false;
  jobsFiltersForm: FormGroup;
  created_at: any;
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


  routeID; // URL ID



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion


  constructor(
    private _formBuilder: FormBuilder,
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,


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
      created_at: [''],
    });
  }
  initCreatedAt() {
    this.created_at = new FormControl();
  }
  applyFilters() {
    !this.jobsFiltersForm.value.created_at ? (this.jobsFiltersForm.value.created_at = '') : ('');
    !this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '';
    !this.jobsFiltersForm.value.destinations ? (this.jobsFiltersForm.value.destinations = '') : ('');
    !this.jobsFiltersForm.value.crop_id?.id ? (this.jobsFiltersForm.value.crop_id = this.jobsFiltersForm.value.crop_id?.id) : '';
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
  }

  removeFilters() {
    this.jobsFiltersForm.reset();
    this.jobsFiltersForm.value.farm_id = '';
    this.jobsFiltersForm.value.created_at = '';
    this.jobsFiltersForm.value.destinations = '';
    this.jobsFiltersForm.value.crop_id = '';
    this.created_at.setValue('');
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);

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

}


