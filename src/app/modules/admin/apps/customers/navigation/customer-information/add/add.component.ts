import { CustomersService } from 'app/modules/admin/apps/customers/customers.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCustomerContact implements OnInit {

  public addContactForm: FormGroup;
  imageURL: string = '';

  constructor(
    public matDialogRef: MatDialogRef<AddCustomerContact>,
    private _formBuilder: FormBuilder,
    
    ) { }

  ngOnInit(): void {
  // Create the form
  this.addContactForm = this._formBuilder.group({
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
    avatar: [null],

});
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

  get formArr() {
    return this.addContactForm.get('farmItemRows') as FormArray;
  }

  get cropArr() {
    return this.addContactForm.get('cropsItemRows') as FormArray;
  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.addContactForm.value);
    this.addContactForm.reset();
  }

  initFarmItemRows() {
    return this._formBuilder.group({
    farmId:[''],
    farmHarvestYear:[''],
    farmName:[''],
    farmTotalAcres:[''],
    });
  }
  initCropItemRows() {
    return this._formBuilder.group({
      cropid: [''],
      cropHarvestYear: [''],
      cropCrop: [''],
      cropPoundsPerBushel: [''],
    });
  }

  
  uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        // this._employeeService.uploadAvatar(this.contact.id, file).subscribe();
    }

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.addContactForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        // this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        // this.contact.avatar = null;
    }

    showPreview(event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.addContactForm.patchValue({
        avatar: file
      });
      this.addContactForm.get('avatar').updateValueAndValidity()
      // File Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      }
      reader.readAsDataURL(file)
    }


  addNewFarmRow() {
    this.formArr.push(this.initFarmItemRows());
  }

  deleteFarmRow(index: number) {
    this.formArr.removeAt(index);
  }

  addNewCropRow() {
    this.cropArr.push(this.initCropItemRows());
  }

  deleteCropRow(index: number) {
    this.cropArr.removeAt(index);
  }
  
   /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {
      this.matDialogRef.close();


    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    send(): void
    {
      console.log(this.addContactForm.controls);

    }

}
