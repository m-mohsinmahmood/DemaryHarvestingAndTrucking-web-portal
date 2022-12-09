import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MachineryService } from 'app/modules/admin/apps/equipment/machinery/machinery.service';
import { Router } from '@angular/router';

@Component({
    selector: 'motorized-list',
    templateUrl: './motorized.component.html',
    styles: [
        /* language=SCSS */
        `
            .machinery-grid {
                grid-template-columns: 3% 25% 14% 14% 14% 14% 14%;

                @screen sm {
                    grid-template-columns: 3% 25% 14% 14% 14% 14% 14%;
                }
                @screen md {
                    grid-template-columns: 3% 25% 14% 14% 14% 14% 14%;
                }
                @screen lg {
                    grid-template-columns: 3% 25% 14% 14% 14% 14% 14%;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class MotorizedListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;


    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProductForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _inventoryService: MachineryService,
        private _matDialog: MatDialog
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

     }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle employee details
     *
     * @param machineId
     */
    toggleDetails(machineId: string): void {
        this._router.navigate([
            `/apps/equipment/motorized/details/${machineId}`,
        ]);
    }
    // openAddDialog(): void
    // {
    //     // Open the dialog
    //     const dialogRef = this._matDialog.open(UpdateAddMachineryComponent);
    //     /* const dialogRef = this._matDialog.open(UpdateComponent,{
    //      data:{id: '7eb7c859-1347-4317-96b6-9476a7e2784578ba3c334343'}
    //     }); */

    //     dialogRef.afterClosed()
    //              .subscribe((result) => {
    //                  console.log('Compose dialog was closed!');
    //              });
    // }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
