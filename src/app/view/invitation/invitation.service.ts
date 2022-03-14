import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class InvitationService extends BaseService {
  // baseUrl = environment.apiUrl;

  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUserTotalCount = (): any => {
    const requestURL = 'Invitation/GetTotalCount';
    return this.get(requestURL).pipe(catchError(this.handleError));
  };

  public GetUsersInformationByOrg = (
    pageNumber: number,
    pageSize: number,
    searchKey: string,
    filterObj: any
  ): any => {
    const requestURL = 'Invitation/GetAll';
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

  public GetAllTeam = (pageNumber: number, pageSize: number): any => {
    const requestURL = 'Team/GetAll';
    const requestBody = {
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.post(requestURL, requestBody).pipe(
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
    const requestURL = 'Invitation/InviteUser';
    const requestBody = {
      invitationEmail: email,
      name: fullName,
      teamId: teamId,
      phone: phone,
      address: address,
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public DeleteInvitation = (email: string): any => {
    const requestURL = 'Invitation/DeleteInvitation';
    const requestBody = {
      email: email,
    };
    return this.post(requestURL, requestBody).pipe(
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
