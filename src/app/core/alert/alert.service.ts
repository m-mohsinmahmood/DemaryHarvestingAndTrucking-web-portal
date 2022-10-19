import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from './alert.model';

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private show_alert: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    readonly show_alert$: Observable<boolean> = this.show_alert.asObservable();

    private alert_info: BehaviorSubject<Alert> = new BehaviorSubject<Alert>(
        null
    );
    readonly alert_info$: Observable<Alert> = this.alert_info.asObservable();
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    showAlert(_alert_info : Alert){
        this.alert_info.next(_alert_info);
        this.show_alert.next(true);
        setTimeout(()=>{                           // <<<---using ()=> syntax
            this.show_alert.next(false);
            this.alert_info.next(null);
        }, _alert_info.time);
    }
}
