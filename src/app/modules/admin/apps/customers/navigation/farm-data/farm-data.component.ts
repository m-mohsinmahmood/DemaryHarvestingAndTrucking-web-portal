/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Input, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subscription } from 'rxjs';
import { CustomersService } from '../../customers.service';
import { AddFarmComponent } from '../farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit {
    @Input() customerFields: any;
    @Input() customerId: string;
    @Input() customerFarms: any;

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
            });
    }

    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent,{
            data: {
                customerFarms: this.customerFarms,
                id: this.customerId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    openEditFarmDialog(event): void {
        const dialogRef = this._matDialog.open(AddFarmComponent, {
            data: {
                customerFarms: this.customerFarms,
                isEdit: 'true',
                customer_id: this.customerId,
                field_name: event.field_name,
                field_id: event.field_id,
                farm_name: event.farm_name,
                farm_id: event.farm_id,
                acres:  event.acres,
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
        const dialogRef = this._matDialog.open(AddCropComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditCropDialog(): void {
        const dialogRef = this._matDialog.open(AddCropComponent, {
            data: {
                isEdit: 'true',
                cropName: 'Barley',
                calenderYear: '2022',
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openAddDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    openEditDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent, {
            data: {
                isEdit: 'true',
                farmName: 'Barley',
                name: 'Arizona',
                calenderYear: '2022',
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
