import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, filter } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class IncomeService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllIncome = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any): any => {
    const requestBody = {
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize,
      filterObj: filterObj
    };
    return this.post('Income/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveIncome = (Description: string, Amount: string, Type: string): any => {
    const requestBody = {
      Description: Description,
      Amount: Amount,
      Type: Type
    };
    return this.post('Income/Add', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateIncome = (
    id: string,
    organizationId: string,
    incomeDescription: string,
    incomeType: string,
    incomeAmount: string,
  ): any => {
    const requestBody = {
      id: id,
      organizationId: organizationId,
      Description: incomeDescription,
      Type: incomeType,
      Amount: incomeAmount,
    };
    return this.post('Income/Update', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteIncome = (id: any): any => {
    const requestBody = {
      incomeId: id,
    };
    return this.post('Income/Delete', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    return this.get('Income/GetTotalCount').pipe(catchError(this.handleError));
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
