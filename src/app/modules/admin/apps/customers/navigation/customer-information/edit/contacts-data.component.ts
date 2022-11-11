/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomersService } from '../../../customers.service';
import { AddCustomerContact } from '../add/add.component';
import { states } from './../../../../../../../../JSON/state';

@Component({
    selector: 'contacts-data',
    templateUrl: './contacts-data.component.html',
    styleUrls: ['./contacts-data.component.scss'],
})
export class ContactsDataComponent implements OnInit {

    //#region Variables
    @Input() customers: any;
    @Input() isContactData: boolean = true;
    @Output() toggleCustomerContacts: EventEmitter<any> =
        new EventEmitter<any>();
    isEdit: boolean = false;
    customerContactData: any;
    form: FormGroup;
    imageURL: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    states: string[] = [];
    //#endregion

    // Constructor
    constructor(
        private _formBuilder: FormBuilder,
        private _customerService: CustomersService,
        private _matDialog: MatDialog,
        public matDialogRef: MatDialogRef<ContactsDataComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    //#region Lifecycle Function
    ngOnInit(): void {
        this.initForm();
        this._customerService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if (res) {
                    this.matDialogRef.close();
                    this._customerService.closeDialog.next(false);
                }
        });

        // passing U.S. states
        this.states = states;
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //#endregion
    //#region Form
    initForm(): void {
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: [''],
            first_name: ['',[Validators.required]],
            last_name: ['',[Validators.required]],
            website: [''],
            position: [''],
            address: [''],
            cell_number: ['',[Validators.required]],
            city: [''],
            office_number: [''],
            state: [''],
            email: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            zip_code: [''],
            fax: [''],
            linkedin: [''],
            note_1: [''],
            note_2: [''],
            avatar: [[]],
        });
        const { customerContact } = this.data;
     
        this.form.patchValue({
            id: customerContact.id,
            customer_id: customerContact.customer_id,
            first_name: customerContact.first_name,
            last_name: customerContact.last_name,
            website: customerContact.website,
            position: customerContact.position,
            address: customerContact.address,
            cell_number: customerContact.cell_number,
            office_number: customerContact.office_number,
            city: customerContact.city,
            state: customerContact.state,
            email: customerContact.email,
            zip_code: customerContact.zip_code,
            fax: customerContact.fax,
            linkedin: customerContact.linkedin,
            note_1: customerContact.note_1,
            note_2: customerContact.note_2,
            avatar: customerContact.avatar,
        });
    }
    onSubmit() { 
        this._customerService.isLoadingCustomerContact.next(true);
        this._customerService.updateCustomerContact(this.form.value);
    }
    discard(): void {
        this._customerService.isLoadingCustomerContact.next(false);
        this.matDialogRef.close();
    }
    //#endregion
    //#region Add Dialog
    openAddDialog(): void {
        const dialogRef = this._matDialog.open(AddCustomerContact);
        dialogRef.afterClosed().subscribe((result) => {
        });
    }
    //#endregion

    showPreview(event) {
        // will use for avatar
    }

    backHandler() {
        this.toggleCustomerContacts.emit();
    }


}
