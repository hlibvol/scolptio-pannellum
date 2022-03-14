import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { BaseService } from '../../shared/base.service';
import { FileUpload, Properties } from './properties.model';
import { UpdateOfferPriceFormModel } from './update-offer-price.form.model';

@Injectable()
export class PropertiesService extends BaseService {
  private _propertyOnParent = new Subject<Properties>();
  propertyOnParent = this._propertyOnParent.asObservable();
  private _timelineEvent = new Subject<void>();
  timelineEvent = this._timelineEvent.asObservable();
  constructor(_injector: Injector) {
    super(_injector);
  }

  public ImportFile = (fileName: string, fileContent: string, extension: string): any => {
    const requestURL = 'Properties/ImportFile';
    const requestBody = {
      fileName,
      fileContent,
      extension
    }
    return this.post(requestURL, requestBody, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  public GetMapImportHeader = (fileId: string, listProvider: string, propertyType: string): any => {
    const requestURL = 'Properties/MapImportHeader';
    const requestBody = {
      fileId,
      listProvider,
      propertyType
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }


  public MapProperty = (fileId: string, columnMaps: any): any => {
    const requestURL = 'Properties/MapProperty';
    const requestBody = {
      fileId,
      columnMaps
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public InitiateImport = (fileId: string): any => {
    const requestURL = 'Properties/InitiateImport';
    const requestBody = {
      fileId
    }
    return this.post(requestURL, requestBody, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  public MigrateData = (fileId: string): any => {
    const requestURL = 'Properties/MigrateData';
    const requestBody = {
      fileId
    }
    return this.post(requestURL, requestBody, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  public GetTotalCount = (): any => {
    const requestURL = 'Properties/GetTotalCount';
    return this.get(requestURL).pipe(catchError(this.handleError));
  }

  public GetTotalCountbyDate = (props:any): any => {
    const requestURL = 'Properties/GetTotalCount';
    return this.get(requestURL).pipe(catchError(this.handleError));
  }

  public GetAllProperties = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any): any => {
    const requestURL = 'Properties/GetAll';
    const requestBody = {
      filterObj: filterObj,
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public GetProperties = (propertiesId: string): any => {
    const requestURL = 'Properties/GetProperties?propertiesId=' + propertiesId;
    return this.get(requestURL).pipe(catchError(this.handleError));
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

  public UpdatePropertiesResource = (propertiesId: string, keys: any, resourceType): any => {
    const requestURL = 'Properties/UpdatePropertiesResource';
    const requestBody = {
      propertiesId,
      resourceType,
      keys
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public UpdateProperty = (property: any): any => {
    const requestURL = 'Properties/Update';
    const requestBody = {
      PropertiesId: property.PropertiesId,
      totalAssessedValue: property.totalAssessedValue,
      propertyDimension: property.propertyDimension,
      hoaRestriction: property.hoaRestriction,
      zoningRestriction: property.zoningRestriction,
      accessType: property.accessType,
      visualAccess: property.visualAccess,
      topography: property.topography,
      powerAvailable: property.powerAvailable,
      gasAvailable: property.gasAvailable,
      pertTest: property.pertTest,
      floodZone: property.floodZone,
      survey: property.survey,
      zoning: property.zoning,
      utilities: property.utilities,
      IsDueDiligenceTransaction: property.IsDueDiligenceTransaction
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public DeleteFile = (fileId: string): any => {
    const requestURL = 'File/Delete';
    const requestBody = {
      fileId
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public GetFiles = (fileIds: string[]): any => {
    const requestURL = 'File/GetFiles';
    const requestBody = {
      pageNumber: 1,
      pageSize: 100,
      fileIds
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
  }

  public UpdatePropertiesStatus = (propertiesId: string, resourceStatus: string): any => {
    const requestURL = 'Properties/UpdatePropertiesStatus';
    const requestBody = {
      propertiesId,
      resourceStatus
    }
    return this.post(requestURL, requestBody).pipe(catchError(this.handleError));
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
  setOfferPrice(setOfferPrices: UpdateOfferPriceFormModel[]): Observable<any> {
    return this.post('Properties/OfferPrice', {
      SetOfferPrices: setOfferPrices
    });
  }
  deleteProperies(list: string[]):Observable<any> {
    return this.post('Properties/DeletePropertyBulk', {PropertyIds: list});
  }

  public saveDeligence = (deligence: any): any => {
    const requestBody = deligence;
    console.log(requestBody, "++++++++");
    return this.post('DueDeligence/Add', requestBody).pipe(
      catchError(this.handleError)
    );
  }

  updatePropertyOnParent(property: Properties){
    this._propertyOnParent.next(property);
  }
  GetTimeline(id: any):Observable<any> {
    return this.get('Properties/Timeline?PropertyId=' + id);
  }
  reloadTimeline():void {
    this._timelineEvent.next();
  }
  getLinkedCampaignCount(list: string[]):Observable<boolean> {
    return this.post('Properties/GetLinkedCampaignCount', {PropertyIds: list}, 'text')
  }
  getAdressFromLatlong(){
    return this.httpClient.get("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=47.217954&lon=-1.552918");
  }
}
