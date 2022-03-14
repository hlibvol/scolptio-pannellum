import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Organization } from './organization.model';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class OrganizationService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUserOrganization = (pageNumber: number, pageSize: number, searchKey: string, filterObj: any): any => {
    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchKey: searchKey,
      filterObj: filterObj
    };
    return this.post('Account/GetUserOrganization', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public Save = (organization: Organization): any => {
    const requestBody = {
      orgName: organization.title,
      orgTitle: organization.title,
      imageId: '',
      description: organization.description,
      address: organization.address,
      timeZone: organization.timeZone,
      status: organization.status,
      image: organization.image,
      email:organization.email,
      phone:organization.phone,
      fax:organization.fax
    };
    return this.post('Organization/CreateOrganization', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public Update = (organization: Organization): any => {
    const requestBody = {
      id: organization.id,
      title: organization.title,
      imageId: '',
      description: organization.description,
      address: organization.address,
      timeZone: organization.timeZone,
      status: organization.status,
      adminId: '',
      image: organization.image,
      email:organization.email,
      phone:organization.phone,
      fax:organization.fax
    };
    return this.post('Organization/UpdateOrganization', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public Delete = (data: any): any => {
    return this.post('Organization/DeleteOrganization', data).pipe(
      catchError(this.handleError)
    );
  };

  public GetUserOrganizationTotalCount = (): any => {
    return this.get('Account/GetUserOrganizationTotalCount').pipe(
      catchError(this.handleError)
    );
  };

  public GetCurrentOrganization = (): Observable<Organization> => {
    return this.get('Organization/GetOrgDetail').pipe(
      catchError(this.handleError)
    );
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
}
