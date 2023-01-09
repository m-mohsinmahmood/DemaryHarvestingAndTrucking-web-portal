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
    hideDeleteIcon: boolean;
    deleteText: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel

    ) {
        // Update view with given values
        this.title = data.title;
        this.message = data.message;
        this.hideDeleteIcon = data.hideDeleteIcon? true : false;
        this.deleteText = data.deleteText ? data.deleteText: "Delete";
    }

    //#region Lifecycle functions
    ngOnInit(): void {}

    //#endregion

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onClose(): void {
        // Close the dialog, return true
        this.dialogRef.close(false);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }
    onSubmit(): void{
        this.dialogRef.close(true);   
    }
}
export class ConfirmDialogModel {

    constructor(public title: string, public message: string, public hideDeleteIcon: boolean = false, public deleteText: string = "Delete") {
    }

  }
