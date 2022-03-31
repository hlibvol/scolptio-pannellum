import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { FileUpload } from '../properties/properties.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllProject = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any,teamId:any): any => {
    const requestBody = {
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize,
      filterObj: filterObj,
      teamId : teamId
    };
    return this.post('Project/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveProject = (model: any): any => {
    return this.post('Project/Add', model).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateProject = (
    model: any
  ): any => {
    return this.post('Project/Update', model).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteProject = (id: any): any => {
    const requestBody = {
      Id: id,
    };
    return this.post('Project/Delete', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    return this.get('Project/GetTotalCount').pipe(catchError(this.handleError));
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
  public AddFile = (imageUpload: FileUpload): any => {
    const requestURL = 'File/Add';
    const requestBody = {
      fileKey: imageUpload.fileKey,
      name: imageUpload.fileName,
      extension: imageUpload.extension,
      fileSize: imageUpload.fileSize,
      url: imageUpload.url,
      uploadDate: "2021-08-02T22:25:06.609Z",
      description: imageUpload.type
    }
    return this.post(requestURL, requestBody, { responseType: 'text' }).pipe(catchError(this.handleError));
  }
  public DeleteFile = (fileId: string): any => {
    const requestURL = 'File/Delete';
    const requestBody = {
      fileId
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }
  public UpdateProjectResource = (projectId: string, files: any[], resourceType): any => {
    const requestURL = 'Project/UpdateProjectResource';
    const requestBody = {
      projectId,
      resourceType,
      files
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }
  public GetDocuments = (projectId: string, documentType: string): Observable<any> => {
    return this.post('Project/GetDocuments', {projectId, documentType})
  }
  public DeleteDocument = (fileId: string) => {
    return this.delete('Project/Document?s3FileName=' + fileId);
  }
}
