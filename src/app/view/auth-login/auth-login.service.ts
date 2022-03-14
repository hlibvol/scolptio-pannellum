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
export class AuthLoginService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }

  public Login = (username: string, password: string): any => {
    const requestURL = 'Auth/Login';
    const data = {
      email: username,
      password: password,
    };
    return this.post(requestURL, data, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  };

  public GetUserInformation = (): any => {
    const requestURL = 'Account/GetUserInformation';

    return this.get(requestURL).pipe(catchError(this.handleError));
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
