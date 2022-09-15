import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  @Input() isContactData: boolean;
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
)
{
}

  ngOnInit(): void {
     // Create the selected product form
     this.selectedProductForm = this._formBuilder.group({
      id               : [''],
      harvestYear      : [''],
      name             : [''],
      alternateName      : [''],
      skipInvoiceMath1              : [''],
      arizonaInvoiceMath          : [''],
      skipInvoiceMath2            : [''],
      avatar: [''],
      email            : [''],
      stateProvince    : [''],
      isActive         : [''],
      reserved         : [''],
      cost             : [''],
      basePrice        : [''],
      taxPercent       : [''],
      price            : [''],
      weight           : [''],
      thumbnail        : [''],
      images           : [[]],
      currentImageIndex: [0], // Image index that is currently being viewed
      active           : [false],
      farmId: [''],
      farmHarvestYear: [''],
      farmName: [''],
      farmTotalAcres: [''],
      cropid: [''],
      cropHarvestYear: [''],
      cropCrop: [''],
      cropPoundsPerBushel: [''],
      contactNo: [''],
      customerType:[''],
      phoneNo: [''],
      position:[''],




  });
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
}
