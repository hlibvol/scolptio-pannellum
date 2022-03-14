import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseService } from 'src/app/shared/base.service';
import { Listing } from './listing.model';
import { Properties } from '../properties/properties.model';

@Injectable()
export class ListingService extends BaseService {
  // baseUrl = environment.apiUrl;

  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAll = (orgId: string, filterObj: any, pageSize: number, pageNumber: number): any => {
    const requestURL = 'Listing/GetAll';
    const reqBody = {
      orgId: orgId,
      filterObj: filterObj,
      pageSize: pageSize,
      pageNumber: pageNumber
    }
    return this.post(requestURL, reqBody).pipe(catchError(this.handleError));
  };

  public GetTotalCount = (): any => {
    return this.get('Listing/GetTotalCount').pipe(catchError(this.handleError));
  };

  public Save = (list: Listing): any => {
    const requestURL = 'Listing/Add';
    return this.post(requestURL, list, { responseType: 'text' }).pipe(catchError(this.handleError));
  };

  public Update = (list: Listing): any => {
    const requestURL = 'Listing/Update';
    return this.post(requestURL, list, { responseType: 'text' }).pipe(catchError(this.handleError));
  };

  public Delete = (data: any): any => {
    const requestURL = 'Listing/Delete';
    return this.post(requestURL, data).pipe(catchError(this.handleError));
  };

  public Get = (id: string): any => {
    const requestURL = 'Listing/GetById?listingId=' + id;
    return this.get(requestURL).pipe(catchError(this.handleError));
  };

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else if(typeof error.error === 'string'){
      errorMessage = error.error
    }else{
      // Server-side errors
      errorMessage = 'Something wrong try again later';
    }
    //  
    return throwError(errorMessage);
  }

  public UpdatePropertiesResource = (id: string, keys: any, resourceType,orgId:any): any => {
    const requestURL = 'Listing/UpdatePropertiesResource';
    const requestBody = {
      id,
      resourceType,
      keys,
      orgId
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public deleteImage(image:any){
    const requestURL ="Listing/DeleteImage";
    return this.post(requestURL,image).pipe(catchError(this.handleError));
  }
  
  public MainImage(image:any){
    const requestURL ="Listing/MainImage";
    return this.post(requestURL,image).pipe(catchError(this.handleError));
  }
  apnLookup(apn: string):Observable<Properties[]> {
    return this.get<Properties[]>("Listing/ApnLookup?Apn=" + apn);
  }
}
