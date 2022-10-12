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
    @Input() customerFields: any;
    @Input() customerId: string;
    @Input() customerFarms: any;
    @Input() destinationData: any;
    @Input() cropsData: any;

    searchform: FormGroup = new FormGroup({
        search: new FormControl(),
    });
    search: Subscription;

    isEdit: boolean = false;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    searchResult: string;
    page: number;
    limit: number;
    routeID: any;
    isLoading: any;
    customerCrops$: Observable<any>;
    customerCrop: any;

    constructor(
        private _matDialog: MatDialog,
        private _customersService: CustomersService,
        public activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
        this.search = this.searchform.valueChanges
            .pipe(debounceTime(500))
            .subscribe((data) => {
                this.searchResult = data.search;
                this._customersService.getCustomerField(
                    this.routeID,
                    1,
                    10,
                    '',
                    '',
                    this.searchResult
                );
                this._customersService.getCustomerDestination(
                    this.routeID,
                    1,
                    10,
                    '',
                    '',
                    this.searchResult
                );
                this._customersService.getCustomerCrops(
                    this.routeID,
                    1,
                    3,
                    '',
                    '',
                    this.searchResult
                );
            });

        this.customerCrops$ = this._customersService.customerCrops$;
        // this.customerCrops$.subscribe((m) => {
        //     console.log('---', m);
        //     this.customerCrop = m;
        // });
    }

    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                customerFarms: this.customerFarms,
                id: this.customerId,
                isEdit: false,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    openEditFarmDialog(event): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                customerFarms: this.customerFarms,
                isEdit: true,
                customer_id: this.customerId,
                field_name: event.field_name,
                field_id: event.field_id,
                farm_name: event.farm_name,
                farm_id: event.farm_id,
                acres: event.acres,
                calendar_year: event.calendar_year,
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
    openEditCropDialog(): void {
        const dialogRef = this._matDialog.open(AddCropComponent, {
            data: {
                isEdit: 'true',
                cropName: 'Barley',
                calenderYear: '2022'
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

    sortData(sort: any) {
        this._customersService.getCustomerField(
            this.customerId,
            this.page,
            this.limit,
            sort.active,
            sort.direction,
            this.searchResult
        );
    }

    pageChanged(event) {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getNextData(this.page.toString(), this.limit.toString());
    }

    getNextData(page, limit) {
        this._customersService.getCustomerDestination(this.routeID,page, limit,'','', this.searchResult);
        this._customersService.getCustomerCrops(this.routeID,page, limit,'','', this.searchResult);
        this._customersService.getCustomerField(
            this.customerId,
            page,
            limit,
            '',
            '',
            this.searchResult
        );
    }
}
