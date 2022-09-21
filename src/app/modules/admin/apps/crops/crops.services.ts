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
                cropName: 'Alfalfa',
                variety: 'Alfalfa',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans',
                variety: 'Garbanzo',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 5',
                variety: 'Conventional',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'crop 6',
                variety: 'Foundation',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Alfalfa',
                variety: 'Alfalfa',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            }, {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Barley',
                variety: 'Barley',
                bushelWeight: '55',
            },
            {
                id: '05fb32e7-9fae-4879-8379-d037937fdc24',
                cropName: 'Beans Garbanzo',
                variety: 'Garbanzo',
                bushelWeight: '55',
            },
        ];

        this.totalCount = this.crops.length;
    }
}
