import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'confirmation',
    templateUrl: './confirmation-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent implements OnInit {
    title: string;
    message: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel

    ) {
        // Update view with given values
        console.log('dddd',data);
        this.title = data.title;
        this.message = data.message;
    }

    //#region Lifecycle functions
    ngOnInit(): void {}

    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onClose(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }
    onSubmit(): void{
        console.log('object');
    }
}
export class ConfirmDialogModel {

    constructor(public title: string, public message: string) {
    }

  }
