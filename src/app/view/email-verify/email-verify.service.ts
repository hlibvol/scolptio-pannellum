import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class EmailVerifyService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }

  public VerifyEmail = (code: string, email: string): any => {
    const requestURL = 'Registration/VerifyEmail';
    const data = {
      code: code,
      email: email,
    };
    return this.post(requestURL, data, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  };

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = 'Error : ' + error.error.title;
    }
    //  
    return throwError(errorMessage);
  }
}
