import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApplyNowComponent } from '../landing-page/apply-now/apply-now.component';

@Component({
  selector: 'app-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss']
})
export class EmploymentPageComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _matDialog: MatDialog,

  ) { }

  ngOnInit(): void {
  }

  openDialog() {
    // this.router.navigateByUrl('pages/applicant');
    const dialogRef = this._matDialog.open(ApplyNowComponent, {
        data: {},
    });
    dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
        //Call this function only when success is returned from the create API call//
    });

}

}
