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

@Component({
    selector: 'contacts-data',
    templateUrl: './contacts-data.component.html',
    styleUrls: ['./contacts-data.component.scss'],
})
export class ContactsDataComponent implements OnInit {
    @Input() customers: any;
    @Input() isContactData: boolean = true;
    @Output() toggleCustomerContacts: EventEmitter<any> =
        new EventEmitter<any>();
    isEdit: boolean = false;
    customerContactData: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    form: FormGroup;
    imageURL: string = '';
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _customerService: CustomersService,
        private _matDialog: MatDialog,
        public matDialogRef: MatDialogRef<ContactsDataComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.initForm();
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });
    }

    initForm(): void {
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: [''],
            company_name: ['', [Validators.required]],
            first_name: ['',[Validators.required]],
            last_name: ['',[Validators.required]],
            website: ['',[Validators.required]],
            position: ['',[Validators.required]],
            address: ['',[Validators.required]],
            cell_number: ['',[Validators.required]],
            city: ['',[Validators.required]],
            office_number: ['',[Validators.required]],
            state: ['',[Validators.required]],
            email: ['',[Validators.required]],
            zip_code: ['',[Validators.required]],
            fax: ['',[Validators.required]],
            linkedin: ['',[Validators.required]],
            note_1: ['',[Validators.required]],
            note_2: ['',[Validators.required]],
            avatar: [[]],
        });
        this.form.patchValue({
            id: this.data.customerContact.id,
            customer_id: this.data.customerContact.customer_id,
            company_name: this.data.customerContact.company_name,
            first_name: this.data.customerContact.first_name,
            last_name: this.data.customerContact.last_name,
            website: this.data.customerContact.website,
            position: this.data.customerContact.position,
            address: this.data.customerContact.address,
            cell_number: this.data.customerContact.cell_number,
            city: this.data.customerContact.city,
            office_number: this.data.customerContact.office_number,
            state: this.data.customerContact.state,
            email: this.data.customerContact.email,
            zip_code: this.data.customerContact.zip_code,
            fax: this.data.customerContact.fax,
            linkedin: this.data.customerContact.linkedin,
            note_1: this.data.customerContact.note_1,
            note_2: this.data.customerContact.note_2,
            avatar: this.data.customerContact.avatar,
        });
    }

    openAddDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddCustomerContact);
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    onSubmit() {
        this._customerService.isLoadingCustomerContact.next(true);
        this._customerService.updateCustomerContact(this.form.value);
    }

    showPreview(event) {
        // const file = (event.target as HTMLInputElement).files[0];
        // // this.form.patchValue({
        // //     avatar: file,
        // // });
        // // File Preview
        // const reader = new FileReader();
        // reader.onload = () => {
        //     this.imageURL = reader.result as string;
        // };
        // reader.readAsDataURL(file);
    }

    backHandler() {
        this.toggleCustomerContacts.emit();
    }

    enableEditButton() {
        this.isEdit = false;
    }

    disableEditButton() {
        this.isEdit = true;
    }
    saveAndClose(): void {
        this._customerService.isLoadingCustomerContact.next(false);
        this.matDialogRef.close();
    }
}
