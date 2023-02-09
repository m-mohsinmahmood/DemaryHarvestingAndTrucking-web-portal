import { Subject, takeUntil,Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PolicyDocumentsService } from '../../policy-documents.service';

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

  policyDocuments: any[] = [
    {value: 'Ag Work Agreement'},
    {value: 'Work Itinerary'},
    {value: 'W-4'},
    {value: 'Employee Handbook'},
    {value: 'Dht Work Rules'},
    {value: 'Drug Policy'},
    {value: 'Reprimand Policy'},
    {value: 'Departure Policy'},
    {value: 'Equipment Policy'},
    {value: 'Cdl Training Instructions'},
  ];


  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<UploadPolicyDocumentComponent>,
    private _policyService: PolicyDocumentsService,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initApi();
    this.initObservables();
    this.filterDocuments();
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
    });
  }

  initApi(){
    this._policyService.getPolicyDocuments();
  }

  initObservables() {
    this.isLoadingPolicyDocument$ = this._policyService.isLoadingPolicyDocuments$;
    this._policyService.policyDocuments$.pipe(takeUntil(this._unsubscribeAll)).subscribe((res)=>{
      this.policyDocument = res
    });
    this.closeDialog$ = this._policyService.closeDialog$;
    this._policyService.closeDialog$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res)=> {
      if (res){
        this.matDialogRef.close();
        this._policyService.closeDialog.next(false);
      }
    })

  }

  filterDocuments(){
    this.policyDocument.policy_docs.map((value) => {
      this.policyDocuments = this.policyDocuments.filter(policy => policy.value !== value.document_name);
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
    formData.append('form',JSON.stringify(this.documentForm.value) );
    formData.append('doc', this.documentForm.get('document')?.value);
    this._policyService.addPolicyDocument(formData);
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
}
