/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddCustomerContact implements OnInit {

    //#region Observables
    isLoadingCustomerContact$: Observable<boolean>;
    closeDialog$: Observable<boolean>;
    //#endregion

    //#region Variables
    form: FormGroup;
    routeID: string;
    imageURL: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    //#endregion

    // Constructor
    constructor(
        public matDialogRef: MatDialogRef<AddCustomerContact>,
        private _formBuilder: FormBuilder,
        private _customerService: CustomersService,
        public activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    //#region Lifecycle Function
    ngOnInit(): void {
        this.initObservables();
        this.initForm();
        this._customerService.closeDialog$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
            if (res) {
                this.matDialogRef.close();
                this._customerService.closeDialog.next(false);
            }
        });
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    //#endregion

    //#region Initilize Observables
    initObservables() {
        this.isLoadingCustomerContact$ = this._customerService.isLoadingCustomerContact$;
        this.closeDialog$ = this._customerService.closeDialog$;
    }
    //#endregion

    //#region Form
    initForm(){
        this.form = this._formBuilder.group({
            id: [''],
            customer_id: [this.data.customerId],
            first_name: ['',[Validators.required]],
            last_name: ['',[Validators.required]],
            website: [''],
            position: [''],
            address: [''],
            cell_number: ['',[Validators.required]],
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
    }

    createCustomerContact(customerContact: any): void {
        this._customerService.createCustomerContact(customerContact);
    }

    onSubmit(): void {
        this._customerService.isLoadingCustomerContact.next(true);
        this.createCustomerContact(this.form.value);
    }

    discard(): void {
        this._customerService.isLoadingCustomerContact.next(false);
        this.matDialogRef.close();
    }
    //#endregion

    //#region Avatar
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

    //#endregion

}
