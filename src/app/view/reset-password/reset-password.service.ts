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
export class ResetPasswordService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public ResetPassword = (
    email: string,
    code: string,
    slug: string,
    newPassword: string
  ): any => {
    const data = {
      email: email,
      code: code,
      slug: slug,
      newPassword: newPassword,
    };
    return this.post('Registration/ResetPassword', data).pipe(
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
      errorMessage = 'Something wrong try again later';
    }
    //  
    return throwError(errorMessage);
  }
}
