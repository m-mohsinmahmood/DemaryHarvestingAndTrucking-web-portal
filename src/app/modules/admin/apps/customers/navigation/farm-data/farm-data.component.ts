import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-data',
  templateUrl: './farm-data.component.html',
  styleUrls: ['./farm-data.component.scss']
})
export class FarmDataComponent implements OnInit {
 @Input() customers: any;

  constructor() { }

  ngOnInit(): void {
  }

  openAddFarmDialog(): void {

  }
  openAddCropDialog(): void {

  }

}
