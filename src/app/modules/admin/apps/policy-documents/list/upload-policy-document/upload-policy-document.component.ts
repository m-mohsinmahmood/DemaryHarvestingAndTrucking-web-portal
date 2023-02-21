import { Subject, takeUntil, Observable } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PolicyDocumentsService } from '../../policy-documents.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-policy-document.component.html',
  styleUrls: ['./upload-policy-document.component.scss']
})
export class UploadPolicyDocumentComponent implements OnInit {
  documentForm: FormGroup;
  docPreview: string = '';
  isLoadingPolicyDocument$: Observable<boolean>;
  closeDialog$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  policyDocument$: Observable<any[]>;
  policyDocument: any;
  isEmploymentPeriod: boolean;
  policyDocumentsArray: any = ['Ag Work Agreement First Employment Period','Ag Work Agreement Second Employment Period','Work Itinerary First Employment Period','Work Itinerary Second Employment Period','I-797B First Employment Period',
  'I-797B Second Employment Period']

  // policyDocuments: any[] = [
  //   { value: 'Ag Work Agreement First Employment Period' },
  //   { value: 'Ag Work Agreement Second Employment Period' },
  //   { value: 'Work Itinerary First Employment Period' },
  //   { value: 'Work Itinerary Second Employment Period' },
  //   { value: 'I-797B First Employment Period' },
  //   { value: 'I-797B Second Employment Period' },
  //   { value: 'W-4' },
  //   { value: 'Employee Handbook' },
  //   { value: 'Dht Work Rules' },
  //   { value: 'Drug Policy' },
  //   { value: 'Reprimand Policy' },
  //   { value: 'Departure Policy' },
  //   { value: 'Equipment Policy' },
  //   { value: 'Cdl Training Instructions' },
  // ];


  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<UploadPolicyDocumentComponent>,
    private _policyService: PolicyDocumentsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initApi();
    this.initObservables();
    this.filterDocuments();
    this.formUpdates();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  initForm() {
    this.documentForm = this._formBuilder.group({
      employee_id: [''],
      name: ['', Validators.required],
      document: ['', Validators.required],
      type: ['global'],
      employment_period: [''],
      category: [this.data.category]
    });
  }

  initApi() {
    this._policyService.getPolicyDocuments(this.data.category);
  }

  initObservables() {
    this.isLoadingPolicyDocument$ = this._policyService.isLoadingPolicyDocuments$;
    this._policyService.policyDocuments$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
      this.policyDocument = res
    });
    this.closeDialog$ = this._policyService.closeDialog$;
    this._policyService.closeDialog$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if (res) {
          this.matDialogRef.close();
          this._policyService.closeDialog.next(false);
        }
      })

  }

  filterDocuments() {
    this.policyDocument.policy_docs.map((value) => {
      this.data.policyDocuments = this.data.policyDocuments.filter(policy => policy.value !== value.document_name);
    })
  }


  //#region Form Methods
  discard(): void {
    this._policyService.isLoadingPolicyDocuments.next(false);
    this.matDialogRef.close();
  }

  send(): void {
    this._policyService.isLoadingPolicyDocuments.next(true);
    var formData: FormData = new FormData();
    formData.append('form', JSON.stringify(this.documentForm.value));
    formData.append('doc', this.documentForm.get('document')?.value);
    this._policyService.addPolicyDocument(formData,this.data.category);
    this.filterDocuments();
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

  //#region Form Value Updates
  formUpdates() {
    this.documentForm?.get('name').valueChanges.subscribe((_formValue => {
      if (this.policyDocumentsArray.includes(_formValue) ) {
        this.isEmploymentPeriod = true;
      }
      else {
        this.documentForm?.get('employment_period').setValue('');
        this.isEmploymentPeriod = false;
      }
    }));
  }
  //#endregion
}
