/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor() {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let requestUrl = request.url;
        if (requestUrl.indexOf('api-1') !== -1) {
            requestUrl = requestUrl.replace('api-1', 'https://dht-prod.azurewebsites.net/api');
        }
        else if(requestUrl.indexOf('api-2') !== -1) {
            requestUrl = requestUrl.replace('api-2', 'https://dht-prod-node.azurewebsites.net/api');
        }
        request = request.clone({
            url: requestUrl,
        });
        return next.handle(request);
    }
    //https://dht-dev.azurewebsites.net
    //http://localhost:7071/
}

