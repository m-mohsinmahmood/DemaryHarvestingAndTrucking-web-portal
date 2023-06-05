/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-all-dwrs',
    templateUrl: './all-dwrs.component.html',
    styleUrls: ['./all-dwrs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AllDwrsComponent implements OnInit, AfterViewInit, OnDestroy {

    dwrFiltersForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,

    ) { }

    //#region LifeCycle Hooks
    ngOnInit(): void {
        this.initFiltersForm();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }


    //#region Filters
    applyFilters() {
    }

    removeFilters() {
    }

    initFiltersForm() {
        this.dwrFiltersForm = this._formBuilder.group({
            name: [''],
            date: [''],
            category: [''],
            supervisor: [''],
        });
    }
    //#endregion
}



