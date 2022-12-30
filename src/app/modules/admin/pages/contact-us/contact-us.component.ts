import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
      form: FormGroup;


  constructor(
            private _formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.initContactUsForm();

  }
  initContactUsForm() {
    this.form = this._formBuilder.group({
      id: [''],
      name: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      cell_phone_number: [''],
      inquiry_type: [''],
      message: [''],


    });
  }

  onSubmit(): void {
    console.log(this.form.value);
}

}
