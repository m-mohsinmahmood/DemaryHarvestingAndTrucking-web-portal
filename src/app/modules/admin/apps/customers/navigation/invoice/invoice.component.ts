import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddTruckingItemComponent } from './add-trucking-item/add-trucking-item.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CustomersService } from '../../customers.service';
import { AddHarvestingItemComponent } from './add-harvesting-item/add-harvesting-item.component';
import { AddFarmingItemComponent } from './add-farming-item/add-farming-item.component';
import { lastValueFrom, Observable, skipWhile } from 'rxjs';
import { Customers } from '../../customers.types';
import { AddRentalItemComponent } from './add-rental-item/add-rental-item.component';
import moment from 'moment';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  jobsFiltersForm: FormGroup;
  form: FormGroup;
  harvestFilters: FormGroup;
  isEditMode: boolean = false;
  pdfTable: any;
  created_at: any;


  //#region Observable
  farmingInvoices$: any;
  truckingInvoices$: any;
  harvestingInvoices$: any;
  harvestingAmount: any;
  farmingAmount: any;
  truckingAmount: any;

  customHarvestingList$: any;
  customFarmingList$: any;
  customTruckingList$: any;
  customRentalList$: any;
  jobResultsFarmingInvoice$: any;
  isLoadingJobResultsFarmingInvoice: any;
  filteredFarmingArray: any[] = [];


  totalHarvesting: any = 0;

  routeID; // URL ID

  customer$: Observable<Customers>;
  isLoadingCustomer$: Observable<boolean>;
  total: any = 0;
  sumTotal: any;
  totalFarming = false;
  total2: any;

  constructor(
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _matDialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.filteredFarmingArray = [];
    this.initFiltersForm();
    this.getRouteParams();
    this.initObservables();
    this.initApis();
    

      
  
    


    this.form = this._formBuilder.group({
      billTo: [''],
      notesInvoice: [''],
      addressInInvoice: [''],
      termsInvoice: [''],
      dateInvoice: [''],
      next15Days: [''],
      invoiceNumber: [''],
      balanceInvoice: [''],
      paymentCredit: [''],
      totalInvoice: [''],

    });
  }


  //#region Init Observables
  initObservables() {
    this.customFarmingList$ = this._customerService.customFarmingInvoiceList;
    this.customTruckingList$ = this._customerService.customTruckingInvoiceList;
    this.customHarvestingList$ = this._customerService.customHarvestingInvoiceList;
    this.customRentalList$ = this._customerService.customRentalnvoiceList;
    this.isLoadingCustomer$ = this._customerService.isLoadingCustomer$;
    this.isLoadingJobResultsFarmingInvoice = this._customerService.isLoadingJobResultsFarmingInvoice;
    this.jobResultsFarmingInvoice$ = this._customerService.jobResultsFarmingInvoice$;
    this.customer$ = this._customerService.customer$;

  }

  //#endregion

  //#region Init Apis on Tabs
  initApis() {
    this._customerService.getHarvestingInvoiceList(this.routeID);
    this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value);

    this._customerService.getCustomerById(this.routeID);
    
    this._customerService.jobResultsFarmingInvoice$
      .pipe(skipWhile(data => data === null))
      .subscribe((value: any) => {
        this.filteredFarmingArray = value.totalAmount;
      });



    

  }
  getRelativeTabInvoices(index: number) {
    if (index == 0) {
      this._customerService.getHarvestingInvoiceList(this.routeID);
      console.log(this.customHarvestingList$);
    }
    else if (index == 1) {
      this.cdr.detectChanges(); // Force change detection

      if(this.total == 0) 
      {this.summaryReport();}

      // this.jobResultsFarmingInvoice$.pipe((skipWhile(data => data === null))).subscribe((value: any) => {
      //   this.filteredFarmingArray = value.totalAmount;
      // });
      this.getTotal();
  

      // let result:any = lastValueFrom(this.jobResultsFarmingInvoice$);
      
      // this.filteredFarmingArray = result.totalAmount;
      
      // console.log("this.filteredFarmingArray", this.filteredFarmingArray);

    }
    else if (index == 2) {
      this._customerService.getTruckingInvoiceList(this.routeID);
      console.log(this.customTruckingList$);

    } else if (index == 3) {
      this._customerService.getRentalInvoiceList(this.routeID);
      console.log(this.customRentalList$);

    }
    else {
      this._customerService.getHarvestingInvoiceList(this.routeID);
      this._customerService.getTruckingInvoiceList(this.routeID,);
      this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value);
      this._customerService.getRentalInvoiceList(this.routeID);

    }
  }
  getTotal(){
    this.total2 = this.filteredFarmingArray?.reduce(
      (total3, value) => total3 + parseFloat(value.total_amount_acres),
      0
    );
    
    console.log("2", this.total2)
  }

  summaryReport() {
    this._customerService.jobResultsFarmingInvoice$.pipe((skipWhile(data => data === null))).subscribe((values: any) => {
      values.totalAmount.forEach((value) =>
        this.total += value.total_amount_acres)

    })

  }

  //#region route params function
  getRouteParams() {
    this.activatedRoute.params.subscribe((params) => {
      this.routeID = params.Id;
    });
  }
  //#endregion




  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }
  enableEditButton() {
    this.isEditMode = true;

  }

  disableEditButton() {
    this.isEditMode = false;
  }

  openTruckingDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddTruckingItemComponent);

    dialogRef.afterClosed()
      .subscribe((result) => {
      });
  }


  openAddHarvestingDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddHarvestingItemComponent, {
      data: {
        customer_id: this.routeID
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
      });
  }

  openEditHarvestingDialog(invoiceData) {
    const dialogRef = this._matDialog.open(AddHarvestingItemComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        invoiceData: invoiceData
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }


  openAddFarmingDialog(): void {
    const dialogRef = this._matDialog.open(AddFarmingItemComponent, {
      data: {
      description : this.form.value.description,
      amount: this.form.value.amount
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      console.log(res.data.description, res.data.amount, "resulttttt");
      this.total2 = parseFloat(this.total2) + parseFloat(res.data.amount);
      
      this.filteredFarmingArray.push({
        total_amount_acres : res.data.amount,
        description : res.data.description
      })
      console.log(this.total2, this.filteredFarmingArray, "Hello");
      this.filteredFarmingArray = [...this.filteredFarmingArray];
      this.cdr.detectChanges(); // Force change detection


  })

}

  openEditFarmingDialog(invoiceData) {
    const dialogRef = this._matDialog.open(AddFarmingItemComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        invoiceData: invoiceData
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
  initFiltersForm() {
    this.jobsFiltersForm = this._formBuilder.group({
      service_type: [''],
      quantity_type: [''],
      date_period_start: [''],
      date_period_end: [''],
      created_at: [''],
    });


  }
  //#region Create Invoice
  createInvoice(){
    console.log(this.filteredFarmingArray, this.total2, this.jobsFiltersForm.value, "Payload");
  }

  //#endregion
  initCreatedAt() {
    this.created_at = new FormControl();
  }

  applyFilters() {
    !this.jobsFiltersForm.value.service_type ? (this.jobsFiltersForm.value.service_type = '') : ('');
    !this.jobsFiltersForm.value.quantity_type ? (this.jobsFiltersForm.value.quantity_type = '') : ('');
    !this.jobsFiltersForm.value.date_period_start ? (this.jobsFiltersForm.value.from = '') : ('');
    !this.jobsFiltersForm.value.date_period_end ? (this.jobsFiltersForm.value.to = '') : ('');
    this.jobsFiltersForm.value.date_period_start ? this.jobsFiltersForm.controls['date_period_start'].setValue(moment(this.jobsFiltersForm.value.date_period_start).format('YYYY-MM-DD')) : ('');
    this.jobsFiltersForm.value.date_period_end ? this.jobsFiltersForm.controls['date_period_end']?.setValue(moment(this.jobsFiltersForm.value.date_period_end).format('YYYY-MM-DD')) : ('');
    this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value);
  }

  removeFilters() {
    this.jobsFiltersForm.reset();
    this.jobsFiltersForm.value.service_type = '';
    this.jobsFiltersForm.value.created_at = '';
    this.jobsFiltersForm.value.quantity_type = '';
    this.jobsFiltersForm.value.date_period_start = '';
    this.jobsFiltersForm.value.date_period_end = '';
    this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value);

  }




  openAddTruckingDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddTruckingItemComponent, {
      data: {
        customer_id: this.routeID
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
      });
  }

  openEditTruckingDialog(invoiceData) {
    const dialogRef = this._matDialog.open(AddTruckingItemComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        invoiceData: invoiceData
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  openAddRentalDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(AddRentalItemComponent, {
      data: {
        customer_id: this.routeID
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
      });
  }

  openEditRentalDialog(invoiceData) {
    const dialogRef = this._matDialog.open(AddRentalItemComponent, {
      data: {
        customer_id: this.routeID,
        isEdit: true,
        invoiceData: invoiceData
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  exportAsPDF(MyDIv) {
    let data = document.getElementById('MyDIv');
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      pdf.save('Filename.pdf');
    });
  }

}
