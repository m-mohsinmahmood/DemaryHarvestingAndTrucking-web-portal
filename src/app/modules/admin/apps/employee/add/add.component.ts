
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service'
import { MatDialogRef } from '@angular/material/dialog';
import { Country } from 'app/modules/admin/apps/employee/employee.types';
import { Subject, takeUntil } from 'rxjs';



let governmentDocs = [
  {"docId":"1", "docName": "Passport" , "uploadedDocName": "",  "docType": "image" , "isUpload": false},
  {"docId":"2", "docName": "Visa" , "uploadedDocName": "",  "docType": "image", "isUpload": false},
  {"docId":"3", "docName": "I-94" ,"uploadedDocName": "",  "docType": "image", "isUpload": false},
  {"docId":"4", "docName": "License" , "uploadedDocName": "",  "docType": "image", "isUpload": false},
  {"docId":"5", "docName": "Social Security " , "uploadedDocName": "",  "docType": "image", "isUpload": false},
  {"docId":"6", "docName": "DOT docs" , "uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"7", "docName": "Physical" , "uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"8", "docName": "Drug Testing" , "uploadedDocName": "",  "docType": "file", "isUpload": false},
]
let companyDocs = [
  {"docId":"9", "docName": "Drug Testing" , "uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"10", "docName": "Contract" ,"uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"11", "docName": "Approval Letter" ,"uploadedDocName": "",   "docType": "file", "isUpload": false},
  {"docId":"12", "docName": "Departure Form" ,"uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"13", "docName": "Equipment Usage" ,"uploadedDocName": "",  "docType": "file", "isUpload": false},
  {"docId":"14", "docName": "Work Agreement" , "uploadedDocName": "", "docType": "file", "isUpload": false},
]
let recordDocs = [
  {"docId":"15", "docName": "Work Record" ,"uploadedDocName": "",  "docType": "file", "isUpload": false},
]

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {

  roles: string[] = ['Crew Chief', 'Mechanic', 'Dispatcher', 'Recruiter', 'Training Instructor']
  selectedFiles: any[];
  selectedFileNames: string[] = [];
  progressInfos: any[] = [];
  message: string[] = [];
  imageURL: string = '';
  previews: string[] = [];
  imageInfos?: Observable<any>;
  countries: Country[];
  employeeGovernemtDocs: any[] = governmentDocs;
  employeeCompanyDocs: any[] = companyDocs;
  employeeRecordDocs: any = recordDocs;
  form: FormGroup;
  countryCodeLength: any = 1;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    private _changeDetectorRef: ChangeDetectorRef,


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
    phoneNumbers: this._formBuilder.array([]),
    emergencyContact : ['', [Validators.required]],
    bankingInfo : ['', [Validators.required]],
    salary  : ['',[]],
    currentEmployee : ['',[]],
    wages : ['',[]]
  });


      const phoneNumbersFormGroups = [];
      phoneNumbersFormGroups?.push(
        this._formBuilder.group({
            country    : ['us'],
            phoneNumber: [''],
        })
      );
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.form.get('phoneNumbers') as FormArray)?.push(phoneNumbersFormGroup);
        });

        this._employeeService.countries$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((codes: Country[]) => {
            this.countries = codes;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

  }

  ngAfterContentChecked(): void {
   this._changeDetectorRef.detectChanges()
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
    if (index < 8){
      this.employeeGovernemtDocs[index].isUpload  = false;
      this.employeeGovernemtDocs[index].uploadedDocName = '';
    }
    else if (index > 7 && index < 14){
      let  item = this.employeeCompanyDocs.find((x) => {return x.docId == index+1});
      item.isUpload  = false;
      item.uploadedDocName = '';
    }
    else {
      let  item = this.employeeRecordDocs.find((x) => {return x.docId == index+1});
      item.isUpload  = false;
      item.uploadedDocName = '';
    }
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
      // this.selectedFileNames[index] = event.target.files[0].name;
      if (index < 8){
        this.employeeGovernemtDocs[index].uploadedDocName  = event.target.files[0].name;
        this.employeeGovernemtDocs[index].isUpload  = true;
      }
      else if (index > 7 && index < 14){
        let  item = this.employeeCompanyDocs.find((x) => {return x.docId == index+1});
        item.uploadedDocName  = event.target.files[0].name;
        item.isUpload  = true;
      }
      else  {
        let  item = this.employeeRecordDocs.find((x) => {return x.docId == index+1});
        item.uploadedDocName  = event.target.files[0].name;
        item.isUpload  = true;
      }


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

     /**
     * Get country info by iso code
     *
     * @param iso
     */
      getCountryByIso(iso: string): Country
      {
          const country = this.countries.find(country => country.iso === iso);
          this.countryCodeLength = country.code.length
          return country;
      }

      /**
       * Track by function for ngFor loops
       *
       * @param index
       * @param item
       */
      trackByFn(index: number, item: any): any
      {
          return item.id || index;
      }

}


