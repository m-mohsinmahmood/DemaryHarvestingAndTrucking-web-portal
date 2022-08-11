import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';




@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<UpdateComponent>,

   ) { }

  ngOnInit(): void {
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
