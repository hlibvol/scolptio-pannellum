import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from './auth-register.model';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class AuthRegisterService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public Register = (data: User): any => {
    const requestURL = 'Registration/RegisterUser';
    return this.post(requestURL, data).pipe(catchError(this.handleError));
  };

  public isEmailExist = (email: string): any => {
    const requestURL = 'Registration/UserExist';
    const requestBody = {
      userName: email,
    };
    return this.post(requestURL, requestBody).pipe(
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
