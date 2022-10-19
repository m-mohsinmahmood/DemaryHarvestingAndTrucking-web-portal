import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddRateDataComponent } from './add-rate-data/add-item.component';

@Component({
  selector: 'app-rate-data',
  templateUrl: './rate-data.component.html',
  styles         : [
    /* language=SCSS */
    `
        .rate-data-grid {
            @screen lg {
                grid-template-columns: 15% 15% 20% 30% 20% ;
            }
        }
        .rate-data-grid-trucking {
            @screen lg {
                grid-template-columns: 15% 15% 15% 15% 10% 10% 10%;
            }
        }
    `
    ],
})
export class RateDataComponent implements OnInit {
  form: FormGroup;
  


  constructor(
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,


  ) { }

  ngOnInit(): void {
  console.log('hits');
  }

  onTabChanged(event): void {
     console.log('Log' , event.tab.textLabel);
  }

  openAddDialog(): void
  {
      // Open the dialog
      const dialogRef = this._matDialog.open(AddRateDataComponent);
      console.log('open dialog!');

      dialogRef.afterClosed()
               .subscribe((result) => {
                   console.log('Compose dialog was closed!');
               });
  }

  onSubmit(): void {
    console.warn('Your order has been submitted', this.form.value);
    this.form.reset();
  }


}
