/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../customers.service';
import { AddFarmComponent } from '../farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],

})
export class FarmDataComponent implements OnInit {
    @Input() destinationData: any;
    @Input() cropsData: any;

    isEdit: boolean = true;
    searchResult: string;
    page: number;
    limit: number;
    pageSize = 3;
    currentPage = 0;
    pageSizeOptions: number[] = [3,10, 25, 50, 100];
    search: Subscription;
    routeID: any;
    customerCrops$: Observable<any>;
    customerCrop: any;
    // year: any = moment();


    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });


    constructor(
        private _matDialog: MatDialog,
        private _customersService: CustomersService,
        public activatedRoute: ActivatedRoute,

        ) {}

    ngOnInit(): void {
        console.log('Destination-Data', this.destinationData);
        console.log('Crops-Data', this.cropsData);


        // Getting the route ID
        this.activatedRoute.params.subscribe((params) => {
            console.log('ParamId:',params);
            this.routeID = params.Id;
        });

        // Searching
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customersService.getCustomerDestination(this.routeID,1, 10,'','', this.searchResult);
                this._customersService.getCustomerCrops(this.routeID,1, 3,'','', this.searchResult);
            });

            // Customer Crops
        this.customerCrops$ = this._customersService.customerCrops$;
        this.customerCrops$.subscribe((m)=>{
            console.log('---',m);
            this.customerCrop = m;
        });
        console.log('Customer Crops:', this.customerCrops$);
    }

    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    openEditFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                isEdit: 'true',
                farmName: 'Adam',
                field: 'field',
                acres: '445',
                calenderYear: '2022'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openAddCropDialog(): void {
        this.isEdit = false;
        const dialogRef = this._matDialog.open(AddCropComponent,{
            data:{
                customer_id: this.routeID,
                isEdit: this.isEdit,

            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }


    openAddDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent,{
            data:{
                customer_id: this.routeID,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditDestinationDialog(data): void {
        console.log('Edit data:',data);
        this.isEdit = true;
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                farmdata:{
                    isEdit: this.isEdit,
                    farmName: data.farm_name,
                    name: data.destination_name,
                    calenderYear: data.calendar_year,
                    farmId:data.farm_id,
                    customer_id: this.routeID,
                    destination_id: data.destination_id

                },
                paginationData: {
                    page: this.page,
                    limit: this.limit,
                    search: this.searchResult,
                },
            },

        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    pageChanged(event) {
        console.log('Page Info:',event);
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        this._customersService.getCustomerDestination(this.routeID,page, limit,'','', this.searchResult);
        this._customersService.getCustomerCrops(this.routeID,page, limit,'','', this.searchResult);
    }
}
