import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preliminary-review-dialog',
  templateUrl: './preliminary-review-dialog.component.html',
  styleUrls: ['./preliminary-review-dialog.component.scss']
})
export class PreliminaryReviewDialogComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<PreliminaryReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    // Close the dialog, return true
    this.matDialogRef.close(false);
}

}
