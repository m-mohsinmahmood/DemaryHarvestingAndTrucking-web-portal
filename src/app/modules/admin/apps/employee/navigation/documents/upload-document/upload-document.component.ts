import { Subject, takeUntil,Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../employee.service';


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  documentForm: FormGroup;
  docPreview: string = '';
  isLoadingPolicyDocument$: Observable<boolean>;
  closeDialog$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<UploadDocumentComponent>,
    private _employeeService: EmployeeService,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
}

  initForm() {
    this.documentForm = this._formBuilder.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
    });
  }

  initObservables() {
    this.isLoadingPolicyDocument$ = this._employeeService.isLoadingPolicyDocuments$;
    this.closeDialog$ = this._employeeService.closeDialog$;
    this._employeeService.closeDialog$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res)=> {
      if (res){
        this.matDialogRef.close();
        this._employeeService.closeDialog.next(false);
      }
    })

  }


  //#region Form Methods
  discard(): void {
    this._employeeService.isLoadingPolicyDocuments.next(false);
    this.matDialogRef.close();
  }

  send(): void {
    this._employeeService.isLoadingPolicyDocuments.next(true);
    var formData: FormData = new FormData();
    formData.append('form',JSON.stringify(this.documentForm.value) );
    formData.append('doc', this.documentForm.get('document')?.value);
    this._employeeService.addPolicyDocument(formData);
  }

  //#endregion

  //#region Upload Document
  uploadDoc(event: any) {
    if (
      event.target.files &&
      event.target.files[0]
    ) {
      const reader = new FileReader();
      reader.onload = (_event: any) => {
        this.docPreview = event.target.files[0].name
        this.documentForm.controls['document']?.setValue(event.target.files[0]);

      };
      reader.readAsDataURL(event.target.files[0]);
    } else {

    }
  }
  //#endregion
}
