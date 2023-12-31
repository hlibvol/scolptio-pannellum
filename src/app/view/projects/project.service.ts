import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/base.service';
import { S3File } from 'src/app/shared/models/s3-items-model';
import { FileUpload } from '../properties/properties.model';
import { InventoryFilters, NumericFilter, Payload } from './project-list/inventory-view/inventory-view.model';
import { Notes } from './project-overview/notes/notes.model';
import { Question } from './project-questionnaire/question.model';
import { Room } from './project-questionnaire/room.model';
import { Tag } from './tag/tag.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetAllProject = (pageNumber: number, pageSize: number, searchKey: string, searchStatuses: string[],teamId:any, searchTypes: string[] = [], inventoryFilters: InventoryFilters<Payload> = null): any => {
    const requestBody = {
      searchKey,
      pageNumber,
      pageSize,
      searchStatuses,
      teamId,
      searchTypes,
      inventoryFilters
    };
    return this.post('Project/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetById = (id): any => {
    return this.get('Project/GetById?projectId='+id).pipe(
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

  public DeleteProject = (id: string, inventoryMode: boolean = false): any => {
    const requestBody = {
      Id: id,
      inventoryMode
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
  public getS3ObjectUrl = (key: string, isModel: boolean = false): Observable<string> => {
    let url: string = 'Project/GetS3ObjectUrl?key=' + key;
    if(isModel)
      url += '&isModel=true';
    return this.get(url, {responseType: 'text'});
  }
  public getAllTags = (pageNumber: number, pageSize: number, searchKey: string): Observable<any> => {
    return this.get(`Project/GetTagsByPageNumber?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKey}`);
  }
  public addTag = (tag: Tag): Observable<void> => {
    return this.post('Project/Tag', tag, {responseType: 'text'});
  }
  public editTag = (tag: Tag): Observable<void> => {
    return this.put('Project/Tag', tag, {responseType: 'text'});
  }
  public deleteTag = (id: string): Observable<void> => {
    return this.delete('Project/Tag?id=' + id, {responseType: 'text'})
  }
  public updateDocumentTags = (s3Key: string, tags: Tag[]): Observable<void> => {
    return this.put('Project/UpdateDocumentTags', {s3Key, tags},{responseType: 'text'})
  }
  public prepareQuestionnaire = (id: string): Observable<Room<Question>[]> => {
    return this.get('Project/PrepareQuestionnaire?ProjectId=' + id)
  }
  public saveRoom = (projectId: string, roomForUi: Room<Question>): Observable<Room<Question>> => {
    return this.post('Project/Room', {projectId, roomForUi})
  }
  public deleteRoomById = (roomId: string) => {
    return this.delete('Project/Room?id=' + roomId, {responseType: 'text'})
  }
  public uploadToS3 = (payload: FormData): Observable<S3File> => {
    return this.post('Project/UploadToS3', payload)
  }
  public roomList = (projectId: string): Observable<Room<Question>[]> => {
    return this.get('Project/RoomList?ProjectId=' + projectId);
  }
  public roomDetailsById = (id: string): Observable<Room<Question>> => {
    return this.get('Project/RoomDetailsById?id=' + id);
  }
  public saveQuestion = (question: Question): Observable<any> => {
    return this.put('Project/SaveQuestion', {question: question}, {responseType: 'text'});
  }
  public getAsBlobExternal = (url: string): Observable<Blob> => {
    return this.get(url, {responseType: 'blob'}, true)
  }
  public getS3ObjectBlob = (s3Key: string): Observable<Blob> => {
    return this.get('Project/GetS3ObjectBlob?s3Key=' + s3Key, {responseType: 'blob'});
  }
  public createNotes = (markupContent: string, projectId: string, documentType: string): Observable<Notes> => {
    return this.post('Project/Notes', {
      projectId,
      documentType,
      markupContent
    })
  }
  public updateNotes = (form: any): Observable<Notes> => {
    return this.put('Project/Notes', form)
  }
  public deleteNotes = (id: string): Observable<boolean> => {
    return this.delete('Project/Notes?id=' + id)
  }
  public createDocuments = (projectId: string, files: any[], resourceType): Observable<boolean> => {
    return this.post('Project/CreateDocuments', {
      projectId,
      resourceType,
      files
    })
  }
  public featuredImage = (id: any): Observable<string> => {
    return this.get('Project/featuredImage?projectId=' + id, {responseType: 'text'})
  }
}
