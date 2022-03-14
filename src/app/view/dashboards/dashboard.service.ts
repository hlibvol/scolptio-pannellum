import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }
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

  public GetTotalCountbyDate = (props: any): any => {
    const requestURL = 'Dashboard/GetTotalCount';
    return this.post(requestURL,props).pipe(catchError(this.handleError));
  }

  public getAllOrders = (props: any): any => {
    const requestURL = 'Dashboard/GetAllOrders';
    return this.post(requestURL,props).pipe(catchError(this.handleError));
  }
}
