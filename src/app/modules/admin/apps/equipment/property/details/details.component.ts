/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, APP_INITIALIZER } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'app/modules/admin/apps/equipment/vehicle/vehicle.service';
// import { UpdateAddMachineryComponent } from '../update/update-add.component';
// import { MachineryService } from './../machinery.service';
// import { PartService } from './../part.service';
import {UpdateAddPropertyComponent } from '../update/update-add.component';
import { PropertyService } from 'app/modules/admin/apps/equipment/property/property.service';


const governmentDocs = [
    {'id':'1', 'name': 'Passport' , 'type': 'PDF'},
    {'id':'2', 'name': 'Visa' , 'type': 'DOC'},
    {'id':'3', 'name': 'I-94' , 'type': 'XLS'},
    {'id':'4', 'name': 'License' , 'type': 'TXT'},
    {'id':'5', 'name': 'Social Security ' , 'type': 'JPG'},
    {'id':'6', 'name': 'DOT docs' , 'type': 'DOC'},
    {'id':'7', 'name': 'Physical' , 'type': 'PDF'},
    {'id':'8', 'name': 'Drug Testing' , 'type': 'TXT'},
  ];
  const companyDocs = [
    {'id':'9', 'name': 'Drug Testing' , 'type': 'TXT'},
    {'id':'10', 'name': 'Contract' , 'type': 'PDF'},
    {'id':'11', 'name': 'Approval Letter' , 'type': 'DOC'},
    {'id':'12', 'name': 'Departure Form' , 'type': 'JPG'},
    {'id':'13', 'name': 'Equipment Usage' , 'type': 'XLS'},
    {'id':'14', 'name': 'Work Agreement' , 'type': 'PDF'},
  ];

@Component({
    selector       : 'employee-details',
    templateUrl    : './details.component.html',
    styleUrls: ['./details.component.scss'],
    styles         : [
        /* language=SCSS */
        `
            .employee-detail-grid {
                grid-template-columns: 10% 50% 30%;

                @screen sm {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen md {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
                @screen lg {
                    grid-template-columns: 3% 20% 20% 40% 10%;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyDetailComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading: boolean = false;
    routeID; // URL ID
    vehicleDetails: any;
    employeeGovernemtDocs: any[] = governmentDocs;
    employeeCompanyDocs: any[] = companyDocs;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public _machineService: PropertyService,
        private _router: Router,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
          this.routeID = params.Id;
        });


        // Get the employee by id
        this._machineService.getProductById(this.routeID).subscribe((vehicle) => {
            this.vehicleDetails = vehicle;
        });
      }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    openUpdateDialog(): void
    {
    // Open the dialog
         const dialogRef = this._matDialog.open(UpdateAddPropertyComponent,{
          data:{id: this.routeID}
         });


         dialogRef.afterClosed()
                  .subscribe((result) => {
       });
    }

    backHandler(): void
    {
        this._router.navigate(['/apps/equipment/property']);
    }


}
