import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  combineOperaterStatus: boolean = false;
  tractorCartOperaterStatus = true;
  truckDriverStatus = true;
  farmingTractorOperaterStatus = true;

  form: FormGroup;




  constructor(
    private _formBuilder: FormBuilder,
    public matDialogRef: MatDialog,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
  //     combineOperaterStatus: [''],
  // tractorCartOperaterStatus: [''],
  // truckDriverStatus: [''],
  // farmingTractorOperaterStatus: [''],
      
    });
  }
  
  combineOperator(event: any) {
   
      const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
      dialogRef.afterClosed().subscribe(response => {
        console.log( 'response ', response );
        if (response) {
           this.combineOperaterStatus = !this.combineOperaterStatus;
           console.log('combine operator true',this.combineOperaterStatus)
           console.log("toggle")
        } else {
          console.log('combine operator false',this.combineOperaterStatus)
          console.log("toggle should not change if I click the cancel button")
        }
      })
    }
   
  
    

    

      // at first, reset to the previous value
      // so that the user could not see that the mat-slide-toggle has really changed
      // const dialogRef = this.matDialogRef.open(ConfirmDialogComponent);
      // dialogRef.afterClosed().subscribe(response => {
      //   console.log( 'response ', response );
        
      //   if(e.checked === true && response === true){
          
      //     this.combineOperaterStatus = false;
      //   }
      //   else if(e.checked === false){
      //     this.combineOperaterStatus = true;
      //   }
      // });
      
    

  
  
  


}
