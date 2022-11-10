import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthLoginComponent } from '../view/auth-login/auth-login.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private route: ActivatedRoute) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 && this.route.firstChild instanceof AuthLoginComponent) {
                        if(['', ' ', '/', '\\'].includes(this.router.url) || this.route.snapshot.queryParamMap.get('login_redirect')) {
                            this.router.navigate(['login']);
                          }
                          else{
                            this.router.navigate(['login'], {
                              queryParams: {
                                'login_redirect': this.router.url
                              }
                            });
                          }
                    }
                    return throwError(error);
                })
            )
    }
}