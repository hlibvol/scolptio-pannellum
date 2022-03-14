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
export class ExpenditureService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllExpenditure = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any): any => {
    const requestBody = {
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize,
      filterObj: filterObj
    };
    return this.post('Expenditure/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveExpenditure = (Description: string, Amount: string, Type: string): any => {
    const requestBody = {
      Description: Description,
      Amount: Amount,
      Type: Type
    };
    return this.post('Expenditure/Add', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateExpenditure = (
    id: string,
    organizationId: string,
    expenditureDescription: string,
    expenditureType: string,
    expenditureAmount: string,
  ): any => {
    const requestBody = {
      id: id,
      organizationId: organizationId,
      Description: expenditureDescription,
      Type: expenditureType,
      Amount: expenditureAmount,
    };
    return this.post('Expenditure/Update', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteExpenditure = (id: any): any => {
    const requestBody = {
      expenditureId: id,
    };
    return this.post('Expenditure/Delete', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    return this.get('Expenditure/GetTotalCount').pipe(catchError(this.handleError));
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
