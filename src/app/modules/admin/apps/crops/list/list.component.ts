import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddCropsComponent } from '../add/add.component';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styles: [
        `
            .crop-grid {
                grid-template-columns: 30% 30% 40%;

                @screen sm {
                    grid-template-columns: 30% 30% 40%;
                }
                @screen md {
                    grid-template-columns: 25% 25% 25%;
                }
                @screen lg {
                    grid-template-columns: 30% 30% 40%;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CropsListComponent implements OnInit {

    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();


    constructor(private _matDialog: MatDialog) {}

    ngOnInit(): void {}

    openAddDialog(): void
    {
        const dialogRef = this._matDialog.open(AddCropsComponent);

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }
}
