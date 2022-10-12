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
    }

    createCustomerContact(cropData: any): void {
        this._customerService.createCustomerContact(cropData);
    }
    updateCustomerContact(cropData: any): void {
        this._customerService.updateCustomerContact(cropData, this.data.paginationData);
    }

    onSubmit(): void {
        this._customerService.isLoadingCustomerContact.next(true);
        this.createCustomerContact(this.form.value);
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
        // this.form.patchValue({
        //     avatar: file,
        // });
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
