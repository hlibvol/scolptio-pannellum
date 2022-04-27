import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSessionStorageService } from '../../shared/session-storage.service';
import { AuthLoginService } from './auth-login.service';
import jwt_decode from "jwt-decode";
import { AppUser } from '../auth-register/auth-register.model';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss',
    '../../../assets/auth-pages/css/stylesheet.css',
    '../../../assets/auth-pages/vendor/bootstrap/css/bootstrap-grid.css',
    '../../../assets/auth-pages/vendor/font-awesome/css/all.css']
})
export class AuthLoginComponent implements OnInit {

  email: string;
  password: string;
  errorMsg = '';
  isSaving = false;
  constructor(private authLoginService: AuthLoginService,
    private router: Router,
    private appSessionStorageService: AppSessionStorageService) { }

  ngOnInit(): void {
    this.appSessionStorageService.resetStorage();
  }

  login() {
    this.errorMsg = '';
    this.isSaving = true;
    this.authLoginService.Login(this.email, this.password).subscribe((data: any) => {
      debugger;
      this.appSessionStorageService.storeToken(data.toString());
      const currentUser = jwt_decode(data) as AppUser;
      const user_permissions = JSON.parse(currentUser.Permissions ? currentUser.Permissions : null);
      this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
      this.appSessionStorageService.storeUserPermissions(JSON.stringify(user_permissions));
      this.getUserInformation();
    }, (error) => {
      this.errorMsg = 'Username or password incorrect.';
      this.isSaving = false;

    })

  }

  getUserInformation() {
    this.authLoginService.GetUserInformation().subscribe((data: any) => {
      debugger;
      if (this.appSessionStorageService.getCurrentUser() != null) {
        const currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
        currentUser.DisplayName = data.firstName + ' ' + data.lastName;
        currentUser.occupation = data.occupation;
        currentUser.profileImage = data.profileImage;
        currentUser.teamName = data.teamName;
        this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
      }
      this.router.navigate(['/projects/project-list']);
    }, (error) => {
      this.errorMsg = 'Username or password incorrect.';
      this.isSaving = false;

    })
  }

}
