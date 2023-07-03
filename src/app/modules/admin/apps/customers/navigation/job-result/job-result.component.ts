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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import RobotoFont from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const docDefinition = {
  content: [
    {
      text: 'Hello World',
      font: 'Roboto', // Use the name of the font you want to use
    },
  ],
  // ...
};

@Component({
  selector: 'app-job-result',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit {
  dis=true
  panelOpenState = false;
  jobsFiltersForm: FormGroup;
  truckingFiltersForm: FormGroup;
  farmingFiltersForm: FormGroup;

  //#region Auto Complete Farms
  allFarms: Observable<any>;
  farm_search$ = new Subject();
  //#endregion

 //#region Auto Complete Farms
 allDestinations: Observable<any>;
 destination_search$ = new Subject();
 //#endregion

  //#region Auto Complete fields
  allFields: Observable<any>;
  field_search$ = new Subject();
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
  exportingExcel: boolean = false;



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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
}

  //#region farms autocomplete

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

  //#region fields autocomplete
  getDropdownFields() {
    let value = this.jobsFiltersForm.controls['field_id'].value;
    this.allFields = this._customerService.getDropdownCustomerFields(
      this.routeID,
      this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '',
      value != null ? value : ''
    );
    this.allFields.subscribe((val)=>
    console.log("val",val))
  }

  //Auto Complete Farms Display Function
  displayFieldForAutoComplete(field: any) {
    console.log(field)
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
          this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '',
          value
        );
      });
  }
  //#endregion

  //#region destinations autocomplete
  getDropdownDestinations() {
    let value = this.jobsFiltersForm.controls['destinations_id'].value;
    this.allDestinations = this._customerService.getDropdownCustomerDestinations(
      this.routeID,
      this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '',
  value != null ? value : ''
    );
    this.allDestinations.subscribe((val)=>console.log(val))
  }

  //Auto Complete Farms Display Function
  displayDestinationsForAutoComplete(destination: any) {
    return destination ? `${destination.name}` : undefined;
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
          this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '',
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
    this.exportingExcel = false;
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
  }

  initFiltersForm() {
    this.jobsFiltersForm = this._formBuilder.group({
      farm_id: [''],
      crop_id: [''],
      field_id: [''],
      destinations_id:[''],
      date_range:[''],
      from_date:[''],
      to_date:[''],
      status:['']
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
    if (this.jobsFiltersForm.get('to_date').value !== null) {
      if (this.jobsFiltersForm.value.from_date) {
        this.jobsFiltersForm.controls['from_date'].patchValue(moment(this.jobsFiltersForm.value.from_date).format('YYYY-MM-DD'));
      }
      if (this.jobsFiltersForm.value.to_date) {
        this.jobsFiltersForm.controls['to_date'].patchValue(moment(this.jobsFiltersForm.value.to_date).format('YYYY-MM-DD'));
      }
    }

    !this.jobsFiltersForm.value.farm_id?.id ? (this.jobsFiltersForm.value.farm_id = this.jobsFiltersForm.value.farm_id?.id) : '';
    !this.jobsFiltersForm.value.crop_id?.id ? (this.jobsFiltersForm.value.crop_id = this.jobsFiltersForm.value.crop_id?.id) : '';
    !this.jobsFiltersForm.value.destinations_id?.id ? (this.jobsFiltersForm.value.destinations_id = this.jobsFiltersForm.value.destinations_id?.id) : '';
    !this.jobsFiltersForm.value.field_id?.id ? (this.jobsFiltersForm.value.field_id = this.jobsFiltersForm.value.field_id?.id) : '';
    !this.jobsFiltersForm.value.status ? (this.jobsFiltersForm.value.status = '') : ('');
    !this.jobsFiltersForm.value.from_date ? (this.jobsFiltersForm.value.from_date = '') : ('');
    !this.jobsFiltersForm.value.to_date ? (this.jobsFiltersForm.value.to_date = '') : ('');

    this.harvestingFilterBool = true;
    this._customerService.getHarvestingJobs(this.routeID, 'harvesting', this.jobsFiltersForm.value);
  }

  removeFilters() {
    this.jobsFiltersForm.reset();
    this.jobsFiltersForm.value.farm_id = '';
    this.jobsFiltersForm.value.crop_id = '';
    this.jobsFiltersForm.value.field_id = '';
    this.jobsFiltersForm.value.destinations_id = '';
    this.jobsFiltersForm.value.status = '';
    this.jobsFiltersForm.value.from_date = '';
    this.jobsFiltersForm.value.to_date = '';

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
      this.exportingExcel = false;
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

exportToPdf() {
  // Subscribe to the observable to get the data
  this.customHarvestingJobs$.subscribe(customHarvestingJobs => {
    // Access the harvestingJobs and details from the customHarvestingJobs object
    const harvestingJobs = customHarvestingJobs.harvestingJobs;
    const details = customHarvestingJobs.details[0];

    // Create the definition for the document
    const docDefinition = {
      content: [
        { text: details?.customer_name , style: 'companyHeader' },
        { text: 'Summary', style: 'header' },
        {
          table: {
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        { text: 'Total Net Pounds', style: 'tableHeader' },
                        { text: details?.total_net_pounds || 'N/A', style: 'tableValue' },
                        { text: 'Total Tons', style: 'tableHeader' },
                        { text: details?.total_net_pounds ? details?.total_net_pounds / 2000 : 'N/A', style: 'tableValue' }
                      ],
                      [
                        { text: 'Tons per Acre', style: 'tableHeader' },
                        { text: details?.total_net_pounds / details?.total_acres || 'N/A', style: 'tableValue' },
                        { text: 'Total Bushels', style: 'tableHeader' },
                        { text: details?.total_net_bushels || 'N/A', style: 'tableValue' }
                      ],
                      [
                        { text: 'Bushels per Acre', style: 'tableHeader' },
                        { text: details?.total_net_bushels / details?.total_acres || 'N/A', style: 'tableValue' },
                        { text: 'Total Hundred Weight', style: 'tableHeader' },
                        { text: details?.total_net_pounds ? details?.total_net_pounds / 100 : 'N/A' , style: 'tableValue' }
                      ],
                      [
                        { text: 'DHT Total Loaded Miles', style: 'tableHeader' },
                        { text: details?.total_loaded_miles || 'N/A', style: 'tableValue' },
                        { text: 'DHT Average Miles', style: 'tableHeader' },
                        { text: details?.total_loaded_miles / details?.total_tickets , style: 'tableValue' }
                      ],
                      [
                        { text: 'Total Loads', style: 'tableHeader' },
                        { text: harvestingJobs.total_loads || 'N/A', style: 'tableValue' },
                        { text: 'DHT Tickets', style: 'tableHeader' },
                        { text: details?.total_tickets , style: 'tableValue' }
                      ],
                      [
                        { text: 'Farmer Tickets', style: 'tableHeader' },
                        { text: "1234", style: 'tableValue' },
                        { text: 'Company', style: 'tableHeader' },
                        { text: details?.customer_name , style: 'tableValue' }
                      ],
                      // Add more rows for other summary data
                    ]
                  }
                }
              ]
            ]
            
          }
        },
        { text: 'Job Results', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['20%', '15%', '15%', '16%', '10%', '10%', '13%'],
            body: [
              [
                { text: "Field Name", style: 'tableHeader' },
                { text: "Load Date", style: 'tableHeader' },
                { text: "Destination", style: 'tableHeader' },
                { text: "ID/SL", style: 'tableHeader' },
                { text: "Net Pounds", style: 'tableHeader' },
                { text: "Net Bushel", style: 'tableHeader' },
                { text: "Load Miles", style: 'tableHeader' }
              ],
              ...harvestingJobs.map(harvestingJob => [
                { text: harvestingJob.field_name, style: 'tableCell' },
                { text: new Date(harvestingJob.load_date).toLocaleDateString("en-GB"), style: 'tableCell' },
                { text: harvestingJob.destination, style: 'tableCell' },
                { text: harvestingJob.ticket_name + '/' + (harvestingJob.sl_number || ''), style: 'tableCell' },
                { text: harvestingJob.net_pounds, style: 'tableCell' },
                { text: harvestingJob.net_bushel, style: 'tableCell' },
                { text: harvestingJob.load_miles, style: 'tableCell' }
              ])
            ]
          }
        }
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: '#CCCCCC',
          alignment: 'center'
        },
        tableValue: {
          fontSize: 12,
          alignment: 'center'
        },
        tableCell: {
          alignment: 'center',
          textTransform: 'uppercase'  
        },
        companyHeader: {
          fontSize: 24,
          bold: true,
          alignment: 'center'
        },
      }
  
    };

    // Generate the PDF document
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    // Download the PDF file
    pdfDocGenerator.download('JobResults.pdf');
  });
}

}


