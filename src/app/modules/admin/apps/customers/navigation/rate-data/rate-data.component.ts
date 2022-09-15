import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-data',
  templateUrl: './rate-data.component.html',
  styles         : [
    /* language=SCSS */
    `
        .rate-data-grid {
            grid-template-columns: 10% 50% 30%;

            @screen sm {
                grid-template-columns: 10% 20% 20% 20% 15% 10% 10%;
            }
            @screen md {
                grid-template-columns: 10% 20% 20% 20% 15% 10% 10% ;
            }

            @screen lg {
                grid-template-columns: 10% 20% 20% 20% 15% 10% 10%;
            }
        }
    `
    ],
})
export class RateDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  console.log("hits");
  }

  onTabChanged(event) {
    console.log("Log" , event.tab.textLabel);
  }

}
