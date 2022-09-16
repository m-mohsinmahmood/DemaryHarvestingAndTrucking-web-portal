import { Input, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFarmComponent } from '../farm-data/add-farm/add-farm.component';
import { AddCropComponent } from './add-crop/add-crop.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';

@Component({
    selector: 'app-farm-data',
    templateUrl: './farm-data.component.html',
    styles: [
        /* language=SCSS */
        `
            .farm-data-grid {
                grid-template-columns: 25% 25 25% 25%;

                @screen sm {
                    grid-template-columns: 10% 20% 20% 20% 15% 10% 10%;
                }
                @screen md {
                    grid-template-columns: 25% 25 25% 25%;
                }

                @screen lg {
                    grid-template-columns: 20% 30% 30% 20%;
                }
            }
        `,
    ],
})
export class FarmDataComponent implements OnInit {
    @Input() customers: any;

    constructor(private _matDialog: MatDialog) {}

    ngOnInit(): void {}

    openAddDestinationDialog(): void {
        const dialogRef = this._matDialog.open(AddDestinationComponent);
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

    openAddFarmDialog(): void {
        const dialogRef = this._matDialog.open(AddFarmComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
