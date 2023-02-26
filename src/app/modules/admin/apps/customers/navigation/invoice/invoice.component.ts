import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddTruckingItemComponent } from './add-trucking-item/add-trucking-item.component';
import { CustomersService } from '../../customers.service';
import { AddHarvestingItemComponent } from './add-harvesting-item/add-harvesting-item.component';
import { AddFarmingItemComponent } from './add-farming-item/add-farming-item.component';
import { firstValueFrom, lastValueFrom, Observable, skipWhile } from 'rxjs';
import { Customers } from '../../customers.types';
import { AddRentalItemComponent } from './add-rental-item/add-rental-item.component';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
// import * as htmlToImage from 'html-to-image';
// import autoTable from 'jspdf-autotable';
import { AddDetailsComponent } from './add-details/add-details.component';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
    @ViewChild('myDiv', { static: false }) myDiv: ElementRef;

    jobsFiltersForm: FormGroup;
    truckingFiltersForm: FormGroup;
    harvestFilters: FormGroup;
    form: FormGroup;
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
    customFarmingInvoiceList$: any;
    customTruckingInvoiceList$: any;
    customRentalList$: any;
    jobResultsFarmingInvoice$: any;
    isLoadingJobResultsFarmingInvoice: any;
    filteredFarmingArray: any[] = [];
    filteredFarmingJobs: any[] = [];
    farmingTitleForm: FormGroup;
    truckingTitleForm: FormGroup;


    filteredTruckingArray: any[] = [];
    filteredTruckingJobs: any[] = [];

    farmingFilterBoolean: boolean = false;
    panelOpenState = true;



    totalHarvesting: any = 0;

    routeID; // URL ID

    customer$: Observable<Customers>;
    isLoadingCustomer$: Observable<boolean>;
    sumTotal: any;
    totalFarmingHours: any;
    total: any;
    totalFarmingAcres: any;
    farmingObject = {};


    constructor(
        private _customerService: CustomersService,
        public activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _matDialog: MatDialog,
        private cdr: ChangeDetectorRef,
        public matDialogRef: MatDialog,

    ) {

    }

    ngOnInit(): void {
        this.filteredFarmingArray = [];
        this.initFiltersForm();
        this.getRouteParams();
        this.initObservables();
        this.initApis();


    }


    //#region Init Observables
    initObservables() {
        this.customFarmingInvoiceList$ = this._customerService.customFarmingInvoiceList$;
        this.customTruckingInvoiceList$ = this._customerService.customTruckingInvoiceList$;
        // this.customTruckingList$ = this._customerService.customTruckingInvoiceList;
        // this.customHarvestingList$ = this._customerService.customHarvestingInvoiceList;
        // this.customRentalList$ = this._customerService.customRentalnvoiceList;
        this.isLoadingCustomer$ = this._customerService.isLoadingCustomer$;
        // this.isLoadingJobResultsFarmingInvoice = this._customerService.isLoadingJobResultsFarmingInvoice;
        // this.jobResultsFarmingInvoice$ = this._customerService.jobResultsFarmingInvoice$;
        this.customer$ = this._customerService.customer$;

    }

    //#endregion

    //#region Init Apis on Tabs
    initApis() {
        // this._customerService.getHarvestingInvoiceList(this.routeID);
        this._customerService.getCustomerById(this.routeID);
    }

    async getRelativeTabInvoices(index: number) {
        if (index == 0) {
            this._customerService.getHarvestingInvoiceList(this.routeID);
            console.log(this.customHarvestingList$);
        }
        else if (index == 1) {
            this._customerService.getFarmingInvoiceList(this.routeID, 'getFarmingInvoices');
            let result: any = await lastValueFrom(this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value));
            this.filteredFarmingArray = result.totalAmount;
            this.filteredFarmingJobs = result.jobResults;
            console.log(this.filteredFarmingArray, "here", this.customFarmingInvoiceList$);

        }

        else if (index == 2) {
            this._customerService.getTruckingInvoiceList(this.routeID, 'getTruckingInvoices');

            let result2: any = await lastValueFrom(this._customerService.getJobResultsTruckingInvoice(this.routeID, 'allTruckingCustomerJobResult', this.truckingFiltersForm.value));
            this.filteredTruckingArray = result2.totalAmount;
            this.filteredTruckingJobs = result2.jobResults;

            console.log(this.filteredTruckingJobs, "here22", this.customTruckingInvoiceList$)

        }

        else if (index == 3) {
            this._customerService.getRentalInvoiceList(this.routeID);
            console.log(this.customRentalList$);

        }
        else {
            // this._customerService.getHarvestingInvoiceList(this.routeID);
            // let result: any = await lastValueFrom(this._customerService.getJobResultsTruckingInvoice(this.routeID, 'allTruckingCustomerJobResult', this.truckingFiltersForm.value));
            // this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value);
            // this._customerService.getRentalInvoiceList(this.routeID);

        }
    }


    //#region route params function
    getRouteParams() {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
    }
    //#endregion




    // openTruckingDialog(): void {
    //   const dialogRef = this._matDialog.open(AddTruckingItemComponent, {
    //     data: {
    //       description: this.truckingFiltersForm.value.description,
    //       amount: this.truckingFiltersForm.value.amount,
    //       quantity: this.truckingFiltersForm.value.quantity,
    //       rate: this.truckingFiltersForm.value.rate,
    //     }
    //   })

    //   dialogRef.afterClosed().subscribe(res => {
    //     // received data from dialog-component

    //     this.filteredTruckingArray.push({
    //       total_amount: res.data.amount,
    //       description: res.data.description,
    //       rate: res.data.rate,
    //       quantity: res.data.quantity,
    //     })
    //     this.filteredTruckingArray = [...this.filteredTruckingArray];
    //     this.cdr.detectChanges(); // Force change detection


    //   })
    // }


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



    openAddFarmingDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmingItemComponent, {
            data: {
                description: this.jobsFiltersForm.value.description,
                amount: this.jobsFiltersForm.value.amount,
                quantity: this.jobsFiltersForm.value.quantity,
                rate: this.jobsFiltersForm.value.rate,
            }
        })

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            console.log(res.data.description, res.data.amount, "resulttttt");
            this.totalFarmingAcres = parseFloat(this.totalFarmingAcres) + parseFloat(res.data.amount);

            this.filteredFarmingArray.push({
                total_amount: res.data.amount,
                description: res.data.description,
                rate: res.data.rate,
                quantity: res.data.quantity,
            })
            console.log(this.totalFarmingAcres, this.filteredFarmingArray, "Hello");
            this.filteredFarmingArray = [...this.filteredFarmingArray];
            this.cdr.detectChanges(); // Force change detection


        })

    }


    initFiltersForm() {
        this.jobsFiltersForm = this._formBuilder.group({
            service_type: [''],
            quantity_type: ['acres'],
            date_period_start: [''],
            date_period_end: [''],
            created_at: [''],
        });

        this.truckingFiltersForm = this._formBuilder.group({
            service_type: [''],
            quantity_type: ['acres'],
            date_period_start: [''],
            date_period_end: [''],
            created_at: [''],
        });

        this.farmingTitleForm = this._formBuilder.group({
            farmingTitle: [''],
            date: [''],
            invoice_no: [''],
            details: [''],
            notes: [''],
            terms: [''],
            deliver_in: ['']
        });

        this.truckingTitleForm = this._formBuilder.group({
            truckingTitle: [''],
            date: [''],
            invoice_no: [''],
            details: [''],
            notes: [''],
            terms: [''],
            deliver_in: ['']
        });


    }
    //#region Create Invoice
    createInvoice() {
        let invoiceObj = {
            invoice: this.filteredFarmingArray,
            total_amount: this.totalAmount(),
            filters: this.jobsFiltersForm.value,
            title: this.farmingTitleForm.value,
        }
        this._customerService.createFarmingInvoice(invoiceObj, this.routeID, 'updateInvoicedWorkOrder');
        console.log("Invoice Object", invoiceObj);
    }

    createTruckingInvoice() {
        let invoiceObj = {
            invoice: this.filteredTruckingArray,
            total_amount: this.totalTruckingAmount(),
            filters: this.truckingFiltersForm.value,
            title: this.truckingTitleForm.value,
        }
        this._customerService.createTruckingInvoice(invoiceObj, this.routeID, 'updateInvoicedDeliveryTicket');

        console.log("Invoice Object", invoiceObj);
    }


    //#endregion


    async applyFarmingFilters() {
        !this.jobsFiltersForm.value.service_type ? (this.jobsFiltersForm.value.service_type = '') : ('');
        !this.jobsFiltersForm.value.quantity_type ? (this.jobsFiltersForm.value.quantity_type = '') : ('');
        !this.jobsFiltersForm.value.date_period_start ? (this.jobsFiltersForm.value.from = '') : ('');
        !this.jobsFiltersForm.value.date_period_end ? (this.jobsFiltersForm.value.to = '') : ('');
        this.jobsFiltersForm.value.date_period_start ? this.jobsFiltersForm.controls['date_period_start'].setValue(moment(this.jobsFiltersForm.value.date_period_start).format('YYYY-MM-DD')) : ('');
        this.jobsFiltersForm.value.date_period_end ? this.jobsFiltersForm.controls['date_period_end']?.setValue(moment(this.jobsFiltersForm.value.date_period_end).format('YYYY-MM-DD')) : ('');
        let result: any = await lastValueFrom(this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value));
        this.filteredFarmingArray = result.totalAmount;
        this.filteredFarmingJobs = result.jobResults;
        this.farmingFilterBoolean = true;
        this.cdr.detectChanges();
    }

    async removeFarmingFilters() {
        this.jobsFiltersForm.reset();
        this.jobsFiltersForm.value.service_type = '';
        this.jobsFiltersForm.value.created_at = '';
        this.jobsFiltersForm.value.quantity_type = '';
        this.jobsFiltersForm.value.date_period_start = '';
        this.jobsFiltersForm.value.date_period_end = '';
        let result: any = await lastValueFrom(this._customerService.getJobResultsFarmingInvoice(this.routeID, 'allCustomerJobResult', this.jobsFiltersForm.value));
        this.filteredFarmingArray = result.totalAmount;
        this.filteredFarmingJobs = result.jobResults;
        this.farmingFilterBoolean = false;

    }


    async applyTruckingFilters() {
        !this.truckingFiltersForm.value.service_type ? (this.truckingFiltersForm.value.service_type = '') : ('');
        !this.truckingFiltersForm.value.quantity_type ? (this.truckingFiltersForm.value.quantity_type = '') : ('');
        !this.truckingFiltersForm.value.date_period_start ? (this.truckingFiltersForm.value.from = '') : ('');
        !this.truckingFiltersForm.value.date_period_end ? (this.truckingFiltersForm.value.to = '') : ('');
        this.truckingFiltersForm.value.date_period_start ? this.truckingFiltersForm.controls['date_period_start'].setValue(moment(this.truckingFiltersForm.value.date_period_start).format('YYYY-MM-DD')) : ('');
        this.truckingFiltersForm.value.date_period_end ? this.truckingFiltersForm.controls['date_period_end']?.setValue(moment(this.truckingFiltersForm.value.date_period_end).format('YYYY-MM-DD')) : ('');
        let result2: any = await lastValueFrom(this._customerService.getJobResultsTruckingInvoice(this.routeID, 'allTruckingCustomerJobResult', this.truckingFiltersForm.value));
        this.filteredTruckingArray = result2.totalAmount;
        this.filteredTruckingJobs = result2.jobResults;
        this.farmingFilterBoolean = true;
        this.cdr.detectChanges();
    }

    async removeTruckingFilters() {
        this.truckingFiltersForm.reset();
        this.truckingFiltersForm.value.service_type = '';
        this.truckingFiltersForm.value.created_at = '';
        this.truckingFiltersForm.value.quantity_type = '';
        this.truckingFiltersForm.value.date_period_start = '';
        this.truckingFiltersForm.value.date_period_end = '';
        let result2: any = await lastValueFrom(this._customerService.getJobResultsTruckingInvoice(this.routeID, 'allTruckingCustomerJobResult', this.truckingFiltersForm.value));
        this.filteredTruckingArray = result2.totalAmount;
        this.filteredTruckingJobs = result2.jobResults;
        this.farmingFilterBoolean = false;

    }




    openAddTruckingDialog(): void {
        const dialogRef = this._matDialog.open(AddTruckingItemComponent, {
            data: {
                rate_type: this.truckingFiltersForm.value.rate_type,
                amount: this.truckingFiltersForm.value.amount,
                quantity: this.truckingFiltersForm.value.quantity,
                rate: this.truckingFiltersForm.value.rate,
            }
        })

        dialogRef.afterClosed().subscribe(res => {
            console.log(res.data, "resulttttt");

            this.filteredTruckingArray.push({
                total_amount: res.data.amount,
                rate_type: res.data.rate_type,
                rate: res.data.rate,
                quantity: res.data.quantity,
            })
            this.filteredTruckingArray = [...this.filteredTruckingArray];
            this.cdr.detectChanges(); // Force change detection


        })

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



    async exportAsPDF(MyDiv) {
        // var pdf = new jsPDF('p', 'cm');
        // var pageWidth = pdf.internal.pageSize.width;
        // var pageHeight = pdf.internal.pageSize.height;
        // //#region Adding Filters and Chart to the PDF
        // let dataUrl1 = await htmlToImage.toPng(document.getElementById(MyDiv), { quality: 1, height: document.getElementById(MyDiv).offsetWidth, width: document.getElementById(MyDiv).offsetWidth });
        // pdf.addImage(dataUrl1, 'PNG', 0, 0, pageWidth, pageHeight);
        // //#endregion
        // //#region Adding Tables to PDF
        // pdf.addPage();
        // let head = [['Date', 'Service', 'Farm', 'Field', 'Acres', 'Hours', 'Status']];
        // let data = this.filteredFarmingJobs.map((item) => {
        //   return Object.values(item);
        // })
        // pdf.text('Invoiced Customer Job Results', 1.38, 1, null, { fontSize: 16, bold: true });
        // autoTable(pdf, {
        //   head: head,
        //   body: data,
        //   didDrawCell: (data) => { },
        // });
        // //#endregion
        // pdf.save('Farming-Invoice.pdf')
    }

    totalAmount() {
        let amount = 0;
        this.filteredFarmingArray.map((item) => {
            amount = amount + parseFloat(item.total_amount);
        });
        return amount;
    }


    totalTruckingAmount() {
        let amount = 0;
        this.filteredTruckingArray.map((item) => {
            if (item.total_amount != null) {
                amount = amount + parseFloat(item.total_amount);
            }
        });
        return amount.toFixed(2);
    }

    //#region Paid button
    payInvoice(msg, id) {
        const dialogRef = this.matDialogRef.open(ConfirmDialogComponent, {
            data: {
                message: msg,
            },
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response === true && msg == 'farming') {
                this._customerService.payFarmingInvoice(id, 'updatePaidWorkOrder', this.routeID)
                console.log("Paid", msg);
            } else if (response === true && msg == 'trucking') {
                this._customerService.payTruckingInvoice(id, 'updatePaidDeliveryTicket', this.routeID)
                console.log("Paid", msg);
            }
        });

    }


    openDetailsDialog(str): void {
        const dialogRef = this._matDialog.open(AddDetailsComponent, {
        })

        dialogRef.afterClosed().subscribe(res => {
            if (str == 'farming') {
                this.farmingTitleForm.setValue({
                    date: res.data.date,
                    invoice_no: res.data.invoice_no,
                    details: res.data.details,
                    notes: res.data.notes,
                    terms: res.data.terms,
                    deliver_in: res.data.deliver_in,
                    farmingTitle: ''
                })
            }
            else if (str == 'trucking') {
                this.truckingTitleForm.setValue({
                    date: res.data.date,
                    invoice_no: res.data.invoice_no,
                    details: res.data.details,
                    notes: res.data.notes,
                    terms: res.data.terms,
                    deliver_in: res.data.deliver_in,
                    truckingTitle: ''
                })
            }
            console.log(this.farmingTitleForm.value, "resulttttt");


        })

    }


}
