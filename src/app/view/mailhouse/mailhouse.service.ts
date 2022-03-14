import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Mailhouse } from './mailhouse.model';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class MailhouseService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAll = (orgId: string): any => {
    const requestURL = 'Mailhouse/GetAll';
    return this.get(requestURL).pipe(catchError(this.handleError));
  };

  public Save = (list: Mailhouse): any => {
    const requestURL = 'Mailhouse/Add';
    return this.post(requestURL, list).pipe(catchError(this.handleError));
  };

  public Update = (list: Mailhouse): any => {
    const requestURL = 'Mailhouse/Update';
    return this.post(requestURL, list).pipe(catchError(this.handleError));
  };

  public Delete = (data: any): any => {
    const requestURL = 'Mailhouse/Delete';
    return this.post(requestURL, data).pipe(catchError(this.handleError));
  };

  public GetAllOrders = (): any => {
    const requestURL = 'PostCard/GetAllOrders'
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
