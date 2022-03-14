import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class LayoutService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUserOrganization = (): any => {
    const requestBody = {
      pageNumber: 1,
      pageSize: 1000,
    };
    return this.post('Account/GetUserOrganization', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public TokenExchange = (orgId: string): any => {
    const requestBody = {
      orgId: orgId,
    };

    return this.post('Account/TokenExchange', requestBody, {
      responseType: 'text',
    }).pipe(catchError(this.handleError));
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
