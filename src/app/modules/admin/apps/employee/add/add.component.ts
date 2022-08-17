
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service'
import { MatDialogRef } from '@angular/material/dialog';


let governmentDocs = [
  {"docId":"1", "docName": "Passport" , "docType": "image"},
  {"docId":"2", "docName": "Visa" , "docType": "image"},
  {"docId":"3", "docName": "I-94" , "docType": "image"},
  {"docId":"4", "docName": "License" , "docType": "image"},
  {"docId":"5", "docName": "Social Security " , "docType": "image"},
  {"docId":"6", "docName": "DOT docs" , "docType": "file"},
  {"docId":"7", "docName": "Physical" , "docType": "file"},
  {"docId":"8", "docName": "Drug Testing" , "docType": "file"},
]
let companyDocs = [
  {"docId":"9", "docName": "Drug Testing" , "docType": "file"},
  {"docId":"10", "docName": "Contract" , "docType": "file"},
  {"docId":"11", "docName": "Approval Letter" , "docType": "file"},
  {"docId":"12", "docName": "Departure Form" , "docType": "file"},
  {"docId":"13", "docName": "Equipment Usage" , "docType": "file"},
  {"docId":"14", "docName": "Work Agreement" , "docType": "file"},
]

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {

  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors']
  selectedFiles: any[];
  selectedFileNames: string[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  imageURL: string = '';
  previews: string[] = [];
  imageInfos?: Observable<any>;
  employeeGovernemtDocs: any[] = governmentDocs;
  employeeCompanyDocs: any[] = companyDocs;


  form: FormGroup;
  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    
    ) {
    }
    

  ngOnInit(): void {
  // Create the form
  this.form = this._formBuilder.group({
    avatar: [null],
    name: [''],
    firstName     : ['', [Validators.required]],
    lastName     : ['', [Validators.required]],
    role    : ['', [Validators.required]],
    position: ['', [Validators.required]],
    email   : ['', [Validators.email]],
    address : ['', [Validators.required]],
    phone : ['', [Validators.required]],
    emergencyContact : ['', [Validators.required]],
    bankingInfo : ['', [Validators.required]],
    salary  : ['',[]],
    currentEmployee : ['',[]]
  });

    // this.uploader.progressSource.subscribe(progress => {
    //   this.progress = progress;
    // });
  }
  
  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }
  
  
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  
  removeDocHandler(index) {
  debugger;
  this.selectedFileNames.splice(index,1)
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
        const avatarFormControl = this.form.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        // this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        // this.contact.avatar = null;
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

    }
    selectFiles(event: any , index: any): void {
      this.message = [];
      this.progressInfos = [];
      this.selectedFileNames[index] = event.target.files[0].name;
  
      this.previews = [];
      if (this.selectedFiles && this.selectedFiles[0]) {
        const numberOfFiles = this.selectedFiles.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
  
          reader.onload = (e: any) => {
            console.log(e.target.result);
            this.previews.push(e.target.result);
          };
  
          reader.readAsDataURL(this.selectedFiles[i]);
  
        //  this.selectedFileNames.push(this.selectedFiles[i].name);
        }
      }
    }
    
    upload(idx: number, file: File): void {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
  
      if (file) {
      
      }
    }
    
    uploadFiles(): void {
      this.message = [];
  
      if (this.selectedFiles) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload(i, this.selectedFiles[i]);
        }
      }
    }

}


