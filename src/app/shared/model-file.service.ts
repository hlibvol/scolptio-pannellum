import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModelFileService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllModelFiles = (model: any): any => {
    return this.post('ModelFile/GetFiles', model).pipe(
      catchError(this.handleError)
    );
  };

  public UploadModelFile = (model: any): any => {
    return this.post('ModelFile/UploadFile', model, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  };

  public DownloadModelFile = (
    model: any
  ): any => {
    return this.post('ModelFile/DownloadFile', model).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteModelFile = (id: any): any => {
    const requestBody = {
      fileId: id,
    };
    return this.post('ModelFile/Delete', requestBody).pipe(
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
