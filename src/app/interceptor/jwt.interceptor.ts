import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigsLoaderService } from '../services/configs-loader.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private configLoaderService: ConfigsLoaderService, private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = sessionStorage.getItem('key_token');
    if(!token){
      token = this.cookieService.get('jwt');
    }
      
    if (token && request.url.includes(this.configLoaderService.ApiUrl)) { // Call is authenticated and internal
      if(request.body instanceof FormData){
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' 
            /*
             Required Content-Type is multipart/form-data in this case.
             But this header, and the Boundary, must be set by Angular during the call, not tampered with before
            */
          },
        });
      }
      else{
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      }
    }

    if (request.url && request.url.search('Login') > -1) {
      request = request.clone({
        responseType: 'text',
      });
    } else if (request.url && request.url.search('VerifyEmail') > -1) {
      request = request.clone({
        responseType: 'text',
      });
    } else if (request.url && request.url.search('TokenExchange') > -1) {
      request = request.clone({
        responseType: 'text',
      });
    }
    return next.handle(request);
  }
}
