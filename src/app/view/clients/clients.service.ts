import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllClients = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any,clientId:any): any => {
    const requestBody = {
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize,
      filterObj: filterObj,
      clientId: clientId
    };
    return this.post('Clients/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveClients = (model: any): any => {
    return this.post('Clients/Add', model).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateClients = (
    model: any
  ): any => {
    return this.post('Clients/Update', model).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteClients = (id: any): any => {
    const requestBody = {
      Id: id,
    };
    return this.post('Clients/Delete', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    return this.get('Clients/GetTotalCount').pipe(catchError(this.handleError));
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

