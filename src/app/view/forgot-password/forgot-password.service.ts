import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class ForgotPasswordService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public ForgotPassword = (email: string): any => {
    const requestURL = 'Registration/ForgotPassword';
    const data = {
      email: email,
    };
    return this.post(requestURL, data).pipe(catchError(this.handleError));
  };

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = 'Something wrong try again later';
    }
    //  
    return throwError(errorMessage);
  }
}
