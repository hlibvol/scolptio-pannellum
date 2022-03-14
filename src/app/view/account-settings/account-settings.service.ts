import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../auth-register/auth-register.model';
import { BaseService } from 'src/app/shared/base.service';

@Injectable()
export class AccountSettingService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  public GetUserInformation = (): any => {
    const requestURL = 'Account/GetUserInformation';
    return this.get(requestURL).pipe(catchError(this.handleError));
  };

  public UpdateUserInformation = (userInfo: User): any => {
    console.log(userInfo)
    const requestURL = 'Account/UpdateUserInformation';
    const requestBody = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      address: userInfo.address,
      dob: userInfo.dob,
      salutation: userInfo.salutation,
      countryName: userInfo.countryName,
      profileImageUrl: userInfo.profileImageUrl,
      profileImage: userInfo.profileImage,
      displayName: userInfo.displayName,
      occupation: userInfo.occupation,
      signature: userInfo.signature
    };
    return this.post(requestURL, requestBody).pipe(
      catchError(this.handleError)
    );
  };

  public ChangePassword = (oldPassword: string, newPassword: string): any => {
    const requestURL ='Account/ResetPassword';
    const requestBody = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    return this
      .post(requestURL, requestBody)
      .pipe(catchError(this.handleError));
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
