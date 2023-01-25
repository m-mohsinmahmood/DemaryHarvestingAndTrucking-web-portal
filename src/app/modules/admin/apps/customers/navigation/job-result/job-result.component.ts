import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { number } from 'joi';
import { Observable, Subject } from 'rxjs';
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

  //#region Observable
  customFarmingJobs$: any;
  customHarvestingJobs$: any;
  commercialTruckingJobs$: any;

  routeID; // URL ID



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion


  constructor(
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    this.getRouteParams();
    this.initObservables();
    this.initApis();
  }

  //#region Init Observables
  initObservables() {
    this.customFarmingJobs$ = this._customerService.customFarmingJobs;
    this.customHarvestingJobs$ = this._customerService.customHarvestingJobs;
    this.commercialTruckingJobs$ = this._customerService.commercialTruckingJobs;


  }

  //#endregion

  //#region Init Apis on Tabs
  initApis(){
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting');
    console.log(this.customHarvestingJobs$);
  }
  getRelativeTabJobs(index: number) {
    if( index == 0)
    {
      this._customerService.getHarvestingJobs(this.routeID, 'harvesting');
      console.log(this.customHarvestingJobs$);
    }
    else if( index == 1)
    {
      this._customerService.getTruckingJobs(this.routeID, 'trucking');
      console.log(this.commercialTruckingJobs$);
    }
    else if( index == 2)
    {
      this._customerService.getFarmingJobs(this.routeID, 'farming');
      console.log(this.customFarmingJobs$);
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

}


