/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCustomerContact implements OnInit {

    isLoadingCustomerContact$: Observable<boolean>;
    closeDialog$: Observable<boolean>;

    form: FormGroup;
    routeID: string;
    imageURL: string = '';

    constructor(
        public matDialogRef: MatDialogRef<AddCustomerContact>,
        private _formBuilder: FormBuilder,
        private _customerService: CustomersService,
        public activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.isLoadingCustomerContact$ = this._customerService.isLoadingCustomerContact$;
        this.closeDialog$ = this._customerService.closeDialog$;
        this._customerService.closeDialog$.subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: [this.data.customerId],
            company_name: ['', [Validators.required]],
            first_name: [''],
            last_name: [''],
            website: [''],
            position: [''],
            address: [''],
            cell_number: [''],
            city: [''],
            office_number: [''],
            state: [''],
            email: [''],
            zip_code: [''],
            fax: [''],
            linkedin: [''],
            note_1: [''],
            note_2: [''],
            avatar: [[]],
        });
        // Create the form
        // if (this.data && this.data.customerContactData.isEdit) {
        //     this.form.patchValue({
        //         id: this.data.customerContactData.id,
        //         customer_id:this.data.customerContactData.customer_id,
        //         company_name: this.data.customerContactData.company_name,
        //         first_name: this.data.customerContactData.first_name,
        //         last_name: this.data.customerContactData.last_name,
        //         website: this.data.customerContactData.website,
        //         position: this.data.customerContactData.position,
        //         address: this.data.customerContactData.address,
        //         cell_number: this.data.customerContactData.cell_number,
        //         city: this.data.customerContactData.city,
        //         office_number: this.data.customerContactData.office_number,
        //         state: this.data.customerContactData.state,
        //         email: this.data.customerContactData.email,
        //         zip_code: this.data.customerContactData.zip_code,
        //         fax: this.data.customerContactData.fax,
        //         linkedin: this.data.customerContactData.linkedin,
        //         note_1: this.data.customerContactData.note_1,
        //         note_2: this.data.customerContactData.note_2,
        //         avatar: [[]],

        //     });
        // }
        // Create the form

        // this.addContactForm.patchValue({
        //   c_name               : "Cinnova",
        //     c_name2      : "Cinnova",
        //     contact_name             : "Adam Smith",
        //     w_name      : "cinnova.com",
        //     c_position              : "Developer",
        //     address          : "Cincinnati, USA",
        //     c_phonenumber            : "+1(123)-456-7890",
        //     city: "Lorium Ipsum",
        //     o_phonenumber            : "+1(123)-456-7890",
        //     state    : "Lorium Ipsum",
        //     email         : "abc@xyz.com",
        //     zipcode         : "54000",
        //     fax             : "000-0000-0000",
        //     linkedin        : "Lorium Ipsum",
        //     note_1       : "Lorium Ipsum",
        //     note_2            : "Lorium Ipsum",

        // });
    }

    createCustomerContact(cropData: any): void {
        this._customerService.createCustomerContact(cropData);
    }
    updateCustomerContact(cropData: any): void {
        this._customerService.updateCustomerContact(cropData, this.data.paginationData);
    }

    onSubmit(): void {
        this._customerService.isLoadingCustomerContact.next(true);
        // if (this.data && this.data.cropData.isEdit) {
        //     this.updateCustomerContact(this.form.value);
        // } else {
            this.createCustomerContact(this.form.value);
       // }
    }

    saveAndClose(): void {
        this._customerService.isLoadingCustomerContact.next(false);
        this.matDialogRef.close();
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        // this._employeeService.uploadAvatar(this.contact.id, file).subscribe();
    }

    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.form.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        // this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        // this.contact.avatar = null;
    }

    showPreview(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            avatar: file,
        });
        this.form.get('avatar').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.imageURL = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
    /**
     * Discard the message
     */
    discard(): void {
        this.matDialogRef.close();
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {}

    /**
     * Send the message
     */

}
