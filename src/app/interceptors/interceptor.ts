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
@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor() {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (localStorage.getItem('accessToken') != null) {
            const token = localStorage.getItem('accessToken');
            // if the token is  stored in localstorage add it to http header
            const headers = new HttpHeaders().set('accessToken', token);
            //clone http to the custom AuthRequest and send it to the server
            const AuthRequest = request.clone({ headers: headers });
            return next.handle(AuthRequest);
        } else {
            return next.handle(request);
        }
    }
}
