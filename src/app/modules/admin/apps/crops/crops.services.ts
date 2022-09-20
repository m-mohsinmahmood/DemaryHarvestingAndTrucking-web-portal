import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
    providedIn: 'root',
})
export class CropService {
    crops;
    totalCount;
    constructor() {
        this.crops = [
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 1',
                variety: 'variety 1',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 2',
                variety: 'variety 2',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 3',
                variety: 'variety 3',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 4',
                variety: 'variety 4',
                bushelWeight: '55',
            },
        ];

        this.totalCount = this.crops.length;
    }
}
