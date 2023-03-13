import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'app/modules/admin/apps/employee/employee.service';
import { Observable, Subject } from 'rxjs';
import { Item } from '../../employee.types';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    documents: any;
    activeID: any;
    routeID: any;
    employeeDocs$: Observable<any>;
    policyDocument$: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _employeeService: EmployeeService,
        public activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.getParamsId();
        this.initApis();
        this.initObservables();
    }

    getParamsId() {
        this.activatedRoute.params.subscribe((params) => {
            this.routeID = params.Id;
        });
    }
    // #region Init Api's
    initApis(): void {
        // Get Documents Uploaded by Employee
        this._employeeService.getEmployeeDocs(this.routeID);

        // Get Documents Uploaded by Admin
        this._employeeService.getPolicyDocuments(this.routeID, 'onboarding');
    }
    //#endregion

    //#region Init Observables 
    initObservables() {
        this.employeeDocs$ = this._employeeService.employeeDocuments$
        this.policyDocument$ = this._employeeService.policyDocuments$;
    }
    //#endregion

    //#region Download Document
    downloadDocument(url) {
        window.open(url, "_blank");
    }
    //#endregion

    //#region  Tab Change
    tabChanged(event) {
        switch (event.tab.textLabel) {
            case 'Onboarding':
                this._employeeService.getPolicyDocuments(this.routeID, 'onboarding');
                break;
            case 'CDL':
                this._employeeService.getPolicyDocuments(this.routeID, 'cdl');
                break;
            case 'Work':
                this._employeeService.getPolicyDocuments(this.routeID, 'work');
                break;
            case 'Miscellaneous':
                this._employeeService.getPolicyDocuments(this.routeID, 'miscellaneous');
                break;
            default:
        }
    }
    //#endregion
}
