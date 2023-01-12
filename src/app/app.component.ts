import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from 'app/core/alert/alert.service';
import { Alert } from 'app/core/alert/alert.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

    alertInfo: Alert = null;
    showAlert: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _alertService: AlertService) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        //#region Alert Configuration
        // Subscribe to alert show/hide
        this._alertService.show_alert$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((show) => {
                this.showAlert = show;
            });

        // Subscribe to alert information
        this._alertService.alert_info$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((_alertInfo) => {
                this.alertInfo = _alertInfo;
            });
        //#endregion
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
