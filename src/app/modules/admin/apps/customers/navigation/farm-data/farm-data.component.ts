import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-data',
  templateUrl: './farm-data.component.html',
  styles         : [
    /* language=SCSS */
    `
        .farm-data-grid {
            grid-template-columns: 25% 25 25% 25%;

            @screen sm {
                grid-template-columns: 10% 20% 20% 20% 15% 10% 10%;
            }
            @screen md {
                grid-template-columns: 25% 25 25% 25%;
            }

            @screen lg {
                grid-template-columns: 20% 30% 30% 20% ;
            }
        }
    `
    ]
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
