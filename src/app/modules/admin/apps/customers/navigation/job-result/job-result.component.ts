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
import { AcresHarvestingJobs } from './edit-acres-harvesting-jobs/edit-acres-harvesting-jobs.component';

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
  dis = true
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
  isEdit: boolean = false;



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
    this.allFields.subscribe((val) =>
      console.log("val", val))
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
    this.allDestinations.subscribe((val) => console.log(val))
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
      destinations_id: [''],
      date_range: [''],
      from_date: [''],
      to_date: [''],
      status: ['']
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
    !this.jobsFiltersForm.value.field_id?.field_id ? (this.jobsFiltersForm.value.field_id = this.jobsFiltersForm.value.field_id?.field_id) : '';
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
    this.farmingFilterBool = false;
    this._customerService.getFarmingJobs(this.routeID, 'farming', this.farmingFiltersForm.value);
  }
  
  toDecimalPoint(number) {
    if(number){
    const num = parseFloat(number).toFixed(2);
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
    } else{
      return 'N/A'
    }
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

  //#region Add/Edit/Import Dialog

  openEditDialog(event): void {
    console.log(event)
    this.isEdit = true;
    const dialogRef = this._matDialog.open(AcresHarvestingJobs, {
      data: {
        acreData: {
          isEdit: this.isEdit,
          id: event.id,
          acres: event.acres,
          customer_id: this.routeID,
          load_date: event.load_date,
          delivery_ticket: event.delivery_ticket,
          sl_number: event.sl_number,
          net_pounds: event.net_pounds,
          net_bushel: event.net_bushel,
          load_miles: event.load_miles,
          status: event.status,
          crop_id: event.crop_id,
          ticket_name: event.ticket_name,
          destination: {
            destination_name: event.destination,
            destinations_id: event.destinations_id,
          },
          field: {
            field_name: event.field_name,
            field_id: event.field_id,
          },
          routeID: this.routeID,
          farm_id: event.farm_id,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("Object retuned upon closing the modal", result);
    });
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

  editTruckingJob(data: any, id: any) {
    const dialogRef = this._matDialog.open(EditTruckingJobComponent, {
      data: {
        isEdit: true,
        customerId: this.routeID,
        jobId: id,
        jobData: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  editFarmingJob(data: any, id: any) {
    const dialogRef = this._matDialog.open(EditFarmingJobComponent, {
      data: {
        isEdit: true,
        customerId: this.routeID,
        jobId: id,
        jobData: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  exportToPdf() {
    // Subscribe to the observable to get the data
    function capitalizeFirstCharacter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    // Access the harvestingJobs and details from the customHarvestingJobs object
    const filters = this.jobsFiltersForm.value;
    const filterValues = [];


    // Retrieve the farm name from the farm_id input field
    const farmName = this.jobsFiltersForm.controls['farm_id'].value.name;

    // Retrieve the field name from the field_id input field
    const fieldName = this.jobsFiltersForm.controls['field_id'].value.field_name;

    // Retrieve the crop name from the crop_id input field
    const cropName = this.jobsFiltersForm.controls['crop_id'].value.name;

    // Retrieve the destination name from the destinations_id input field
    const destinationName = this.jobsFiltersForm.controls['destinations_id'].value.name;

    this.customHarvestingJobs$.subscribe(customHarvestingJobs => {

      const harvestingJobs = customHarvestingJobs.harvestingJobs;
      const details = customHarvestingJobs.details[0];




      // Add filters to the array if they are not empty or selected
      if (farmName) {
        filterValues.push('Farm Name: ' + farmName);
      }
      if (fieldName) {
        filterValues.push('Field Name: ' + fieldName);
      }
      if (cropName) {
        filterValues.push('Crop Name: ' + cropName);
      }
      if (destinationName) {
        filterValues.push('Destination Name: ' + destinationName);
      }
      if (filters.date_range) {
        filterValues.push('Date Range: ' + filters.date_range);
      }
      if (filters.from_date) {
        filterValues.push('From Date: ' + filters.from_date);
      }
      if (filters.to_date) {
        filterValues.push('To Date: ' + filters.to_date);
      }
      if (filters.status) {
        filterValues.push('Status: ' + filters.status);
      }
      // Create the definition for the document
      const docDefinition = {
        content: [
          { text: details?.customer_name, style: 'companyHeader' },
          // Add filters section if there are filter values
          {
            layout: 'filterTable',
            table: {
              widths: ['33.33%', '33.33%', '33.33%'],
              body: [
                [
                  { text: 'Farm Name:', bold: true },
                  { text: 'Field Name:', bold: true },
                  { text: 'Crop Name:', bold: true }
                ],
                [
                  { text: farmName || 'N/A' },
                  { text: fieldName || 'N/A' },
                  { text: cropName || 'N/A' }
                ],
                [
                  { text: 'Destination Name:', bold: true },
                  { text: 'Date Range:', bold: true },
                  { text: 'Status:', bold: true }
                ],
                [
                  { text: destinationName || 'N/A' },
                  { text: ( filters.from_date +'-' +filters.to_date) || 'N/A' },
                  { text: capitalizeFirstCharacter(filters.status)  || 'N/A' }
                ]
              ]
            }
          },
          { text: 'Summary', style: 'header' },

          {

                    table: {
                      widths: ['25%', '25%', '25%', '25%'], // Set equal width for each cell in the inner table
                      body: [
                        [
                          { text: 'Total Net Pounds', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_net_pounds) || 'N/A', style: 'tableValue' },
                          { text: 'Total Tons', style: 'tableHeader' },
                          { text: details?.total_net_pounds ? this.toDecimalPoint(details?.total_net_pounds / 2000) : 'N/A', style: 'tableValue' }
                        ],
                        [
                          { text: 'Tons per Acre', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_net_pounds / details?.total_acres) || 'N/A', style: 'tableValue' },
                          { text: 'Total Bushels', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_net_bushels) || 'N/A', style: 'tableValue' }
                        ],
                        [
                          { text: 'Bushels per Acre', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_net_bushels / details?.total_acres) || 'N/A', style: 'tableValue' },
                          { text: 'Total Hundred Weight', style: 'tableHeader' },
                          { text: details?.total_net_pounds ? this.toDecimalPoint(details?.total_net_pounds / 100) : 'N/A', style: 'tableValue' }
                        ],
                        [
                          { text: 'DHT Total Loaded Miles', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_loaded_miles) || 'N/A', style: 'tableValue' },
                          { text: 'DHT Average Miles', style: 'tableHeader' },
                          { text: this.toDecimalPoint(details?.total_loaded_miles / details?.total_tickets), style: 'tableValue' }
                        ],
                        [
                          { text: 'Total Loads', style: 'tableHeader' },
                          { text: harvestingJobs.total_loads? this.toDecimalPoint(harvestingJobs.total_loads): 'N/A', style: 'tableValue' },
                          { text: 'DHT Tickets', style: 'tableHeader' },
                          { text: details?.total_tickets, style: 'tableValue' }
                        ],
                        [
                          { text: 'Farmer Tickets', style: 'tableHeader' },
                          { text: "1234", style: 'tableValue' },
                          { text: 'Company', style: 'tableHeader' },
                          { text: details?.company_name, style: 'tableValue' }
                        ],
                        [
                          { text: 'Acres', style: 'tableHeader' },
                          { text: details?.crop_acres || '', style: 'tableValue' },
                          { text: '', style: 'tableHeader' },
                          { text: '', style: 'tableValue' },
                        ],
                        // Add more rows for other summary data
                      ]
                    }

          },
          { text: 'Job Results', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['6%','10%','13%', '13%', '13%', '8%','11%', '14%', '10%', '10%'],
              body: [
                [
                  { text: "Job", style: 'tableHeader' },
                  { text: "Farm Name", style: 'tableHeader' },
                  { text: "Field Name", style: 'tableHeader' },
                  { text: "Load Date", style: 'tableHeader' },
                  { text: "Destination", style: 'tableHeader' },
                  { text: "D. Tkt.", style: 'tableHeader' },
                  { text: "S. Tkt.", style: 'tableHeader' },
                  { text: "Net Pounds", style: 'tableHeader' },
                  { text: "Net Bushel", style: 'tableHeader' },
                  { text: "Load Miles", style: 'tableHeader' }
                ],
                ...harvestingJobs.map(harvestingJob => [
                  { text: harvestingJob.job_setup_name, style: 'tableCell' },
                  { text: harvestingJob.farm_name, style: 'tableCell' },
                  { text: harvestingJob.field_name, style: 'tableCell' },
                  { text: new Date(harvestingJob.load_date).toLocaleDateString("en-US"), style: 'tableCell' },
                  { text: harvestingJob.destination? harvestingJob.destination : '', style: 'tableCell' },
                  { text: harvestingJob.ticket_name||'', style: 'tableCell' },
                  { text: harvestingJob.sl_number ||'', style: 'tableCell' },
                  { text: harvestingJob.net_pounds? this.toDecimalPoint(harvestingJob.net_pounds):'', style: 'tableCell' },
                  { text: this.toDecimalPoint(harvestingJob.net_bushel)|| '', style: 'tableCell' },
                  { text: harvestingJob.load_miles|| '', style: 'tableCell' }
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
            fontSize: 10,
            fillColor: '#CCCCCC',
            alignment: 'center'
          },
          tableValue: {
            fontSize: 11,
            alignment: 'center'
          },
          tableCell: {
            fontSize: 9,
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


  exportToExcel() {
    const filters = this.jobsFiltersForm.value;

    // Define all filters
    const allFilters = [
      { label: 'Farm Name', value: filters.farm_id?.name },
      { label: 'Field Name', value: filters.field_id?.field_name },
      { label: 'Crop Name', value: filters.crop_id?.name },
      { label: 'Destination Name', value: filters.destinations_id?.name },
      { label: 'Date Range', value: filters.date_range },
      { label: 'From Date', value: filters.from_date },
      { label: 'To Date', value: filters.to_date },
      { label: 'Status', value: filters.status }
    ];

    // Subscribe to the observable to get the data
    this.customHarvestingJobs$.subscribe(customHarvestingJobs => {
      const harvestingJobs = customHarvestingJobs.harvestingJobs;
      const details = customHarvestingJobs.details[0];

      // Create Summary Data for Excel Sheet
      const summaryData = [
        ['Total Net Pounds', details?.total_net_pounds? this.toDecimalPoint(details?.total_net_pounds):'N/A', 'Total Tons', details?.total_net_pounds ? this.toDecimalPoint(details?.total_net_pounds / 2000) : 'N/A'],
        ['Tons per Acre', this.toDecimalPoint(details?.total_net_pounds / details?.total_acres) || 'N/A', 'Total Bushels', this.toDecimalPoint(details?.total_net_bushels) || 'N/A'],
        ['Bushels per Acre', this.toDecimalPoint(details?.total_net_bushels / details?.total_acres) || 'N/A', 'Total Hundred Weight', details?.total_net_pounds ? this.toDecimalPoint(details?.total_net_pounds / 100) : 'N/A'],
        ['DHT Total Loaded Miles', details?.total_loaded_miles? this.toDecimalPoint(details?.total_loaded_miles) :'N/A', 'DHT Average Miles', this.toDecimalPoint(details?.total_loaded_miles / details?.total_tickets) || 'N/A'],
        ['Total Loads', harvestingJobs.total_loads? this.toDecimalPoint(harvestingJobs.total_loads): 'N/A', 'DHT Tickets', details?.total_tickets || 'N/A'],
        ['Farmer Tickets', '1234', 'Company', details?.company_name || 'N/A'],
        ['Acres', details.crop_acres|| 'N/A'],

        // Add more rows for other summary data
      ];

        // Create Job Results Data for Excel Sheet
  const jobResultsData = [
    ['Job','Farm Name', 'Field Name', 'Load Date', 'Destination', 'D. Tkt.','S. Tkt.', 'Net Pounds', 'Net Bushel', 'Load Miles'],
    ...harvestingJobs.map(harvestingJob => [
      harvestingJob.job_setup_name,
      harvestingJob.farm_name,
      harvestingJob.field_name,
      new Date(harvestingJob.load_date).toLocaleDateString('en-US'),
      harvestingJob.destination,
      harvestingJob.ticket_name? harvestingJob.ticket_name: '',
      harvestingJob.sl_number?harvestingJob.sl_number:'',
      harvestingJob.net_pounds? harvestingJob.net_pounds: '',
      harvestingJob.net_bushel? harvestingJob.net_bushel:'',
      harvestingJob.load_miles? harvestingJob.load_miles: ''
    ])
  ];

  // Apply custom format to the specific columns in the data rows
  for (let row = 1; row < jobResultsData.length; row++) {
    const rowData = jobResultsData[row];
    for (let col = 5; col <= 8; col++) {
      if (!isNaN(rowData[col])) {
        // Apply custom number format with 1000 separator to the cell
        rowData[col] = { t: 'n', z: '#,##0', v: rowData[col] };
      }
    }
  }
  // Create Job Results Sheet Data for Excel Sheet

      // Create Filters Data for Excel Sheet
  // Create Filters Data for Excel Sheet
  const filterSheetData = XLSX.utils.aoa_to_sheet(allFilters.map(filter => [filter.label, filter.value || 'N/A']));


      // Create Summary Sheet Data for Excel Sheet
      const summarySheetData = XLSX.utils.aoa_to_sheet(summaryData);

      // Create Job Results Sheet Data for Excel Sheet
      const jobResultsSheetData = XLSX.utils.aoa_to_sheet(jobResultsData);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add Filter Sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, filterSheetData, 'Filters');

      // Add Summary Sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, summarySheetData, 'Summary');

      // Add Job Results Sheet to the workbook
      XLSX.utils.book_append_sheet(workbook, jobResultsSheetData, 'Job Results');

      // Export the workbook to an Excel file
      const excelOutput = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      // Convert the Excel output to a Blob
      const blob = new Blob([excelOutput], { type: 'application/octet-stream' });

      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'JobResults.xlsx';

      // Append the link to the DOM
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    });
  }

  toDecimal(value: number | string): string {
    if (typeof value === 'number') {
      // Convert the number to a formatted string with 1000 separator
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else {
      return value; // Return as is if it's not a number
    }
  }


}


