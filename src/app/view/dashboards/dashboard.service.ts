import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { Dashboard } from '../dashboard/dashboard.model';

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

  public GetDashboardDetails = (model:any): Observable<Dashboard> => {
    const requestURL = 'Dashboard/GetDashboardDetails';
    return this.post<Dashboard>(requestURL,model).pipe(catchError(this.handleError));
  }

}
