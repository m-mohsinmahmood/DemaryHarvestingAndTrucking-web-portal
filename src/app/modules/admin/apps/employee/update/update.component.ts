import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';
import { Country } from 'app/modules/admin/apps/employee/employee.types';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
      dateInput: 'YYYY',
  },
  display: {
      dateInput: 'YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const MY_FORMATS_2 = {
  parse: {
      dateInput: 'LL',
  },
  display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Directive({
  selector: '[birthdayFormat]',
  providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_2 },
  ],
})
export class BirthDateFormat {
}

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

]
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateComponent implements OnInit {

  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors'];

  form: FormGroup;
  employees: any;
  imageURL: string = '';
  previews: string[] = [];
  avatar: string = '';
  internationalPhoneNumber: string [] = [];
  countries: Country[];
  countryCodeLength: any = '0';
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,
    private _formBuilder: FormBuilder,
    public _employeeService: EmployeeService,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},

   ) {

    }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      avatar: ['', [Validators.required]],
      fname     : ['', [Validators.required]],
      lname     : ['', [Validators.required]],
      role    : ['', [Validators.required]],
      position: ['', [Validators.required]],
      email   : ['', [Validators.email]],
      address : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      internationalPhoneNumbers: this._formBuilder.array([]),
      emergencyContact : ['', [Validators.required]],
      bankingInfo : ['', [Validators.required]],
      salary  : ['',[]],
      currentEmployee : ['',[]],
      wages : ['',[]]

    });

   // Get the employee by id
   let emp = this._employeeService.getEmployeeById(this.data.id)
   //this.avatar = employee.avatar;
   this.employees = emp;
   this.form.patchValue(emp);
   console.log("emp",this.form);
    const internationalPhoneNumbersFormGroups = [];
    if ( this.employees.internationalPhoneNumber.length > 0 )
    {
        // Iterate through them
            internationalPhoneNumbersFormGroups.push(
                this._formBuilder.group({
                    country    : [this.employees.internationalPhoneNumber[0].country],
                    phoneNumber: [this.employees.internationalPhoneNumber[0].phoneNumber],

                })
            );

    }
    else
    {
        // Create a phone number form group
        internationalPhoneNumbersFormGroups.push(
            this._formBuilder.group({
                country    : ['us'],
                phoneNumber: [''],
            })
        );
    }

    internationalPhoneNumbersFormGroups.forEach((internationalPhoneNumbersFormGroup) => {
        (this.form.get('internationalPhoneNumbers') as FormArray)?.push(internationalPhoneNumbersFormGroup);
    });

//   const internationalPhoneNumbersFormGroups = [];
//   internationalPhoneNumbersFormGroups?.push(
//     this._formBuilder.group({
//         country    : ['us'],
//         phoneNumber: [''],
//     })
//   );
//     internationalPhoneNumbersFormGroups.forEach((internationalPhoneNumbersFormGroup) => {
//         (this.form.get('internationalPhoneNumbers') as FormArray)?.push(internationalPhoneNumbersFormGroup);
//     });

    this._employeeService.countries$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((codes: Country[]) => {
        this.countries = codes;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    });


  }

  ngAfterContentChecked(): void {
    this._changeDetectorRef.detectChanges();
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
    this.form.get('avatar').updateValueAndValidity();
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


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

    /**
     * Get country info by iso code
     *
     * @param iso
     */
     getCountryByIso(iso: string): Country
     {
        const country = this.countries.find(country => country.iso === iso);
        this.countryCodeLength = country.code.length;
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
