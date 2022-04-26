import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class UserService extends BaseService {

  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUserTotalCount = (): any => {
    return this.get('Account/GetUserTotalCount').pipe(
      catchError(this.handleError)
    );
  };

  public GetUsersInformationByOrg = (
    pageNumber: number,
    pageSize: number,
    searchKey: string,
    filterObj: any,
    teamId : string = null
  ): any => {
     
    const requestBody = {
      searchKey: searchKey,
      pageNumber: pageNumber,
      pageSize: pageSize,
      filterObj: filterObj,
      teamId : teamId
    };
    return this.post('Account/GetUsersInformationByOrg', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetAllTeam = (pageNumber: number, pageSize: number): any => {
     

    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.post('Team/GetAll', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public InviteUser = (
    email: string,
    fullName: string,
    teamId: string,
    phone: string,
    address: string
  ): any => {
     
    const requestBody = {
      invitationEmail: email,
      name: fullName,
      teamId: teamId,
      phone: phone,
      address: address,
    };
    return this.post('Account/InviteUser', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public AssignUserRole = (userId: string, roleIds: any): any => {
     

    const requestBody = {
      userId,
      roleIds,
    };
    return this.post('Authorization/AssignUserRole', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public RemoveUserFromOrganization = (userId: string, orgId: string): any => {
    const requestBody = {
      userId,
      orgId,
    };
    return this.post('Account/RemoveUserFromOrganization', requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public GetUserByRole = (role: string): any => {
    const requestBody = {
      role
    };
    return this.post('Account/GetUserByRole', requestBody).pipe(
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
