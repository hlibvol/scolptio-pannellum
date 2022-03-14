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
export class LeadsWebsiteService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetRole = (pageNumber: number, pageSize): any => {
    const requestURL = 'Authorization/GetRole';
    const requestBody = {
      pageNumber,
      pageSize,
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveRole = (roleName: string, permissions: any): any => {
    const requestURL = 'Authorization/CreateRole';
    const requestBody = {
      roleName: roleName,
      permissions: permissions,
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateRole = (id: string, roleName: string, permissions: any): any => {
    const requestURL = 'Authorization/UpdateRole';
    const requestBody = {
      id: id,
      permissions: permissions,
      title: roleName,
      description: roleName,
      category: null,
      isActive: true,
      isShownInUi: true,
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public Delete = (id: any): any => {
    const requestBody = {
      roleId: id,
    };
    return this.post('Authorization/DeleteRole', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetAllTeam = (pageNumber: number, pageSize: number, searchKey: string): any => {
    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchKey: searchKey,
    };
    return this.post('Team/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetUsersInformationByOrg = (
    pageNumber: number,
    pageSize: number
  ): any => {
    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.post('Account/GetUsersInformationByOrg', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public SaveTeam = (teamName: string, members: any, role: string): any => {
    const requestBody = {
      teamName: teamName,
      members: members,
      role: role,
    };
    return this.post('Team/Add', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public UpdateTeam = (
    id: string,
    teamName: string,
    organizationId: string,
    members: any,
    role: string
  ): any => {
    const requestBody = {
      id: id,
      teamName: teamName,
      organizationId: organizationId,
      members: members,
      role: role,
    };
    return this.post('Team/Update', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteTeam = (id: any): any => {
    const requestBody = {
      teamId: id,
    };
    return this.post('Team/Delete', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetTotalCount = (): any => {
    return this.get('Team/GetTotalCount').pipe(catchError(this.handleError));
  };

  public GetRoleTotalCount = (): any => {
    return this.get('Authorization/GetRoleTotalCount').pipe(
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
