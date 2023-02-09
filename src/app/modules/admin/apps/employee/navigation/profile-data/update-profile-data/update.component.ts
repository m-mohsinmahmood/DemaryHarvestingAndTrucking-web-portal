import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../../employee.service';
import { Country } from 'app/modules/admin/apps/employee/employee.types';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
// @Inject(MAT_DIALOG_DATA)

export class UpdateProfileData implements OnInit {

  //#region observables
  isLoadingEmployee$: Observable<boolean>;
  closeDialog$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  //#endregion

  //#region variablles
  roles: string[] = ['Crew Chiefs', 'Mechanics', 'Dispatcher', 'Recruiters', 'Training Instructors'];
  form: FormGroup;
  employees: any;
  imageURL: string = '';
  previews: string[] = [];
  avatar: string = '';
  internationalPhoneNumber: string[] = [];
  countries: Country[];
  countryCodeLength: any = '0';
  //#endregion

  constructor(
    public matDialogRef: MatDialogRef<UpdateProfileData>,
    private _formBuilder: FormBuilder,
    public _employeeService: EmployeeService,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  //#region Lifecycle hooks
  ngOnInit(): void {
    this.initObservables()
    this.initForm();

    this._employeeService.closeDialog$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res) => {
        if (res) {
            this.matDialogRef.close();
            this._employeeService.closeDialog.next(false);
        }
    });
  }

  ngAfterContentChecked(): void {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
}

  //#endregion

  //#region Init Observables
  initObservables() {
    this.isLoadingEmployee$ = this._employeeService.isLoadingEmployee$;
    this.closeDialog$ = this._employeeService.closeDialog$;
  }
  //#endregion

  //#region Init Form
  initForm() {
    this.form = this._formBuilder.group({
      id: ['' || this.data?.id],
      date_of_birth: ['' || this.data.employeeProfileData.date_of_birth, [Validators.required]],
      age: ['' || this.data.employeeProfileData.age, [Validators.required]],
      marital_status: ['' || this.data.employeeProfileData.marital_status, [Validators.required]],
      languages: ['' || this.data.employeeProfileData.languages.replace(/\s/g, '').split(','), [Validators.required]],
      degree_name: ['' || this.data.employeeProfileData.degree_name, [Validators.required]],
      blood_type: ['' || this.data.employeeProfileData.blood_type],
      authorized_to_work: ['' || this.data.employeeProfileData.authorized_to_work.toString(), [Validators.required]],
      us_citizen: ['' || this.data.employeeProfileData.us_citizen.toString(), [Validators.required]],
      cdl_license: ['' || this.data.employeeProfileData.cdl_license.toString(), [Validators.required]],
      lorry_license: ['' || this.data.employeeProfileData.lorry_license.toString(), [Validators.required]],
      tractor_license: ['' || this.data.employeeProfileData.tractor_license.toString(), [Validators.required]],
      passport: ['' || this.data.employeeProfileData.passport.toString(), [Validators.required]],
      rank_speaking_english: ['' || this.data?.employeeProfileData.rank_speaking_english, [Validators.required]],
      question_1: ['' || this.data.employeeProfileData.question_1, [Validators.required]],
      question_2: ['' || this.data.employeeProfileData.question_2, [Validators.required]],
      question_3: ['' || this.data.employeeProfileData.question_3, [Validators.required]],
      question_4: ['' || this.data.employeeProfileData.question_4, [Validators.required]],
      question_5: ['' || this.data.employeeProfileData.question_5, [Validators.required]],
      supervisor_name: ['' || this.data.employeeProfileData.supervisor_name, [Validators.required]],
      supervisor_contact: ['' || this.data.employeeProfileData.supervisor_contact, [Validators.required]],
      work_experience_description: ['' || this.data.employeeProfileData.work_experience_description.toString(), [Validators.required]],
    });
  }
  //#endregion

  //#region Form methods
  discard(): void {
    this.matDialogRef.close();
  }

  submit(): void {
    this._employeeService.isLoadingEmployee.next(true);
    this.form.value['languages'] = this.form.value['languages'].join(', ');
    this._employeeService.updateEmployee("id",this.form.value);
  }

  //#endregion

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


  getCountryByIso(iso: string): Country {
    const country = this.countries.find(country => country.iso === iso);
    this.countryCodeLength = country.code.length;
    return country;
  }

}
