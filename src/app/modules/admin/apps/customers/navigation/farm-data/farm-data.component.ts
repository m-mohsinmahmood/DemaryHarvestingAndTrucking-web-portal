import { Input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFarmComponent } from '../farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styleUrls: ['./farm-data.component.scss'],
})
export class FarmDataComponent implements OnInit {
    @Input() customers: any;

    constructor(private _matDialog: MatDialog) {}

    ngOnInit(): void {}

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
                calenderYear: '2022'
            }
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
                calenderYear: '2022'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
