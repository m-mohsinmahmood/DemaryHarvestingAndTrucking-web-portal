/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
    

  constructor(
    public matDialogRef: MatDialogRef<FilterComponent>,

  ) { }

  ngOnInit(): void {
  }
  saveAndClose(): void
  {
      // Save the message as a draft

      // Close the dialog
      this.matDialogRef.close();
  }

}
