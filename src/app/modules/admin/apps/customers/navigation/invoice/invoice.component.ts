import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddItemComponent } from './add-item/add-item.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  form: FormGroup;
  isEditMode: boolean = false;



  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _matDialog: MatDialog,
  ) { 
    
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      billTo               : [''],
      notesInvoice         : [''],  
      addressInInvoice     : [''],
      termsInvoice         : [''],
      dateInvoice          : [''],
      next15Days           : [''], 
      invoiceNumber           : [''],
      balanceInvoice: [''],
      paymentCredit: [''],
      totalInvoice:[''], 
      
  });  
  }
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }
  enableEditButton()
  {
    this.isEditMode = true;

  }

  disableEditButton() {
    this.isEditMode = false;
  }

  openAddDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(AddItemComponent);
        console.log('open dialog!');

        dialogRef.afterClosed()
                 .subscribe((result) => {
                     console.log('Compose dialog was closed!');
                 });
    }

}
