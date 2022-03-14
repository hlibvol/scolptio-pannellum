import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SalesWebsite } from './sales-website.model';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class SalesWebsiteService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAll = (
    pageNumber: number,
    pageSize: number,
    searchKey: string,
    filterObj: any
  ): any => {
    const requestURL = 'SalesWebsite/GetAll';
    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchKey: searchKey,
      filterObj: filterObj
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    const requestURL = 'SalesWebsite/GetTotalCount';
    return this.get(requestURL).pipe(catchError(this.handleError));
  };

  public GetById = (id:any) : any => {
    return this.get("SalesWebsite/GetById?saleswebsiteId="+id);
  }
  public Save = (list: SalesWebsite): any => {
    return this.post('SalesWebsite/Add', list);
  };

  public Update = (list: SalesWebsite): any => {
    return this.post('SalesWebsite/Update', list).pipe(
      catchError(this.handleError)
    );
  };

  public Delete = (data: any): any => {
    return this.post('SalesWebsite/Delete', data).pipe(
      catchError(this.handleError)
    );
  };

  public UploadImage = (data: any): any => {
    return this.post('SalesWebsite/UploadImage', data).pipe(
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
