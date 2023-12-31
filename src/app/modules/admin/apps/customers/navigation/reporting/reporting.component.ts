import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../customers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reporting',
    templateUrl: './reporting.component.html',
    styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
    panelOpenState = true;
    customerReporting$: any;
    customerId;

    constructor(
        private _customerService: CustomersService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(param => {
            this.customerId = param.Id;
        });

        this.initObservables();
        this.initApis();
    }

    initObservables() {
        this.customerReporting$ = this._customerService.customerReporting$;
    }

    initApis() {
        this._customerService.getCustomerReporting(this.customerId, 'getHarvestingHaulingRevenue');

    }

    getSubTotal(data, getSum) {
        let sum = 0;
        data.map(param => {
            sum += Number(param[getSum]);
        })

        return this.toDecimalPoint(sum);
    }

    toDecimalPoint(number) {
        if(number){
        const num = parseFloat(number).toFixed(2);
        var parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
        } else{
          return 'N/A'
        }
      }

}
