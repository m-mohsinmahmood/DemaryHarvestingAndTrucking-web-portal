import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-data',
  templateUrl: './rate-data.component.html',
  styles         : [
    /* language=SCSS */
    `
        .rate-data-grid {
            @screen lg {
                grid-template-columns: 15% 15% 20% 30% 20% ;
            }
        }
        .rate-data-grid-trucking {
            @screen lg {
                grid-template-columns: 15% 15% 15% 15% 10% 10% 10%;
            }
        }
    `
    ],
})
export class RateDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  console.log('hits');
  }

  onTabChanged(event): void {
     console.log('Log' , event.tab.textLabel);
  }

}
