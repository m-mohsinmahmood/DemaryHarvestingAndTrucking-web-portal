import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  showMoreControls: any;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  stepperPage: any = 0;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', []],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', []],
  });
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', []],
  });
  fourthFormGroup = this._formBuilder.group({
    secondCtrl: ['', []],
  });
  fifthFormGroup = this._formBuilder.group({
    secondCtrl: ['', []],
  });
  sixthFormGroup = this._formBuilder.group({
    secondCtrl: ['', []],
  });

  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<AddComponent>,
    ) { }

  ngOnInit(): void {
   // Horizontal stepper form
//    this.horizontalStepperForm = this._formBuilder.group({
//     step1: this._formBuilder.group({
//         email   : ['', [Validators.required, Validators.email]],
//         country : ['', Validators.required],
//         language: ['', Validators.required]
//     }),
//     step2: this._formBuilder.group({
//         firstName: ['', Validators.required],
//         lastName : ['', Validators.required],
//         userName : ['', Validators.required],
//         about    : ['']
//     }),
//     step3: this._formBuilder.group({
//         byEmail          : this._formBuilder.group({
//             companyNews     : [true],
//             featuredProducts: [false],
//             messages        : [true]
//         }),
//         pushNotifications: ['everything', Validators.required]
//     })
// });

}
onSubmit(): void {
  console.warn('Your order has been submitted', this.horizontalStepperForm.value);
  this.horizontalStepperForm.reset();
}

onStepperNext() {
  this.stepperPage =+1 ;
}
onStepperBack() {
  this.stepperPage =-1 ;
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

}
