import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { AlertService } from 'app/core/alert/alert.service';
import { Router } from '@angular/router';
import { equipmentNavigation } from './equipmentNavigation';
@Injectable({
    providedIn: 'root',
})
export class EquipmentService {
    public navigationLabels = equipmentNavigation;
}
