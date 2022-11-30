import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  combineOperaterStatus = true;
  tractorCartOperaterStatus = true;
  truckDriverStatus = true;
  farmingTractorOperaterStatus = true;

  form: FormGroup;




  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
  //     combineOperaterStatus: [''],
  // tractorCartOperaterStatus: [''],
  // truckDriverStatus: [''],
  // farmingTractorOperaterStatus: [''],
      
    });
  }
 
  combineOperater()
  {
    this.combineOperaterStatus != true;

  }
  openEditFarmDialog2()
  {
    
  }
  openEditFarmDialog3()
  {
    
  }
  openEditFarmDialog4()
  {
    
  }

}
