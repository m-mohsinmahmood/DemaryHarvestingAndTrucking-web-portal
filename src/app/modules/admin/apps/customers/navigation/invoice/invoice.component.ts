import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddTruckingItemComponent } from './add-trucking-item/add-trucking-item.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CustomersService } from '../../customers.service';
import { AddHarvestingItemComponent } from './add-harvesting-item/add-harvesting-item.component';
import { AddFarmingItemComponent } from './add-farming-item/add-farming-item.component';
import { Observable } from 'rxjs';
import { Customers } from '../../customers.types';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  form: FormGroup;
  isEditMode: boolean = false;
  pdfTable: any;

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

  totalHarvesting: any = 0;

  routeID; // URL ID

  customer$: Observable<Customers>;
  isLoadingCustomer$: Observable<boolean>;






  constructor(
    private _customerService: CustomersService,
    public activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _matDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.getRouteParams();
    this.initObservables();
    this.initApis();

    console.log(this.customHarvestingList$);


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
    this.isLoadingCustomer$ = this._customerService.isLoadingCustomer$;
    this.customer$ = this._customerService.customer$;

  }

  //#endregion

  //#region Init Apis on Tabs
  initApis() {
    this._customerService.getHarvestingInvoiceList(this.routeID);
    this._customerService.getCustomerById(this.routeID);

    console.log(this.customer$);

  }
  getRelativeTabInvoices(index: number) {
    if (index == 0) {
      this._customerService.getHarvestingInvoiceList(this.routeID);
      console.log(this.customHarvestingList$);
    }
    else if (index == 1) {
      this._customerService.getFarmingInvoiceList(this.routeID);
      console.log(this.customFarmingList$);
    }
    else if (index == 2) {
      this._customerService.getTruckingInvoiceList(this.routeID);
      console.log(this.customTruckingList$);

    }
    else {
      this._customerService.getHarvestingInvoiceList(this.routeID);
      this._customerService.getTruckingInvoiceList(this.routeID,);
      this._customerService.getFarmingInvoiceList(this.routeID,);
    }
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
    // Open the dialog
    const dialogRef = this._matDialog.open(AddFarmingItemComponent, {
      data: {
        customer_id: this.routeID
      },
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
      });
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
