/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomersService } from '../../../customers.service';

@Component({
  selector: 'contacts-data',
  templateUrl: './contacts-data.component.html',
  styleUrls: ['./contacts-data.component.scss'],
})
export class ContactsDataComponent implements OnInit {

  @Input() customers: any;
  @Input() isContactData: boolean = true;
  @Output() toggleCustomerContacts: EventEmitter <any> = new EventEmitter<any>();
  isEditMode: boolean = false;



  private _unsubscribeAll: Subject<any> = new Subject<any>();
  selectedProductForm: FormGroup;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _customersService: CustomersService,
    private _matDialog: MatDialog,
    private _router: Router,
    public matDialogRef: MatDialogRef<ContactsDataComponent>,

)
{
}

  ngOnInit(): void {
    console.log('contacts-data')
     // Create the selected product form
     this.selectedProductForm = this._formBuilder.group({
      c_name               : [''],
      c_name2      : [''],
      contact_name             : [''],
      w_name      : [''],
      c_position              : [''],
      address          : [''],
      c_phonenumber            : [''],
      city: [''],
      o_phonenumber            : [''],
      state    : [''],
      email         : [''],
      zipcode         : [''],
      fax             : [''],
      linkedin        : [''],
      note_1       : [''],
      note_2            : [''],

  });
  this.selectedProductForm.patchValue({
    c_name               : "Cinnova",
      c_name2      : "Cinnova",
      contact_name             : "Adam Smith",
      w_name      : "cinnova.com",
      c_position              : "Developer",
      address          : "Cincinnati, USA",
      c_phonenumber            : "+1(123)-456-7890",
      city: "Lorium Ipsum",
      o_phonenumber            : "+1(123)-456-7890",
      state    : "Lorium Ipsum",
      email         : "abc@xyz.com",
      zipcode         : "54000",
      fax             : "000-0000-0000",
      linkedin        : "Lorium Ipsum",
      note_1       : "Lorium Ipsum",
      note_2            : "Lorium Ipsum",

  })
  }



  backHandler() {
      this.toggleCustomerContacts.emit();
  }

  enableEditButton()
  {
    this.isEditMode = true;

  }

  disableEditButton() {
    this.isEditMode = false;
  }
  saveAndClose(): void
  {

      // Close the dialog
      this.matDialogRef.close();
  }
}
