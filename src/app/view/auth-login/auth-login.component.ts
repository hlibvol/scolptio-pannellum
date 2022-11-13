import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSessionStorageService } from '../../shared/session-storage.service';
import { AuthLoginService } from './auth-login.service';
import jwt_decode from "jwt-decode";
import { AppUser } from '../auth-register/auth-register.model';
import { SharedService } from 'src/app/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

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
    private appSessionStorageService: AppSessionStorageService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private toastr: ToastrService) { 
    this.sharedService.reloadUserInformation$().subscribe(async () => {
      const cookie = this.cookieService.get('jwt');
      if(cookie){
        this.storeUserData(cookie)
        await this.getUserInformation();
      }
      else
        this.appSessionStorageService.resetStorage();
      window.location.reload();
    });
  }

  ngOnInit(): void {
    const cookie = this.cookieService.get('jwt');
    if(cookie && this.route.snapshot.queryParamMap.get('login_redirect')){
      this.toastr.info('You\'re already logged in. Redirecting...')
      this.storeUserData(cookie)
      this.getUserInformation();
    }
    else
      this.appSessionStorageService.resetStorage();
  }

  login() {
    this.errorMsg = '';
    this.isSaving = true;
    this.authLoginService.Login(this.email, this.password).subscribe(async(data: any) => {
      this.storeUserData(data)
      await this.getUserInformation();
    }, (error) => {
      this.errorMsg = 'Username or password incorrect.';
      this.isSaving = false;

    })

  }

  storeUserData(data: string){
    this.cookieService.deleteAll();
    this.appSessionStorageService.storeToken(data);
    this.cookieService.set('jwt', data);
    const currentUser = jwt_decode(data) as AppUser;
    const user_permissions = JSON.parse(currentUser.Permissions ? currentUser.Permissions : null);
    this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
    this.appSessionStorageService.storeUserPermissions(JSON.stringify(user_permissions));
  }

  async getUserInformation() {
    try{
      let data = await this.authLoginService.GetUserInformation().toPromise();
      if (this.appSessionStorageService.getCurrentUser() != null) {
        const currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
        currentUser.DisplayName = data.firstName + ' ' + data.lastName;
        currentUser.occupation = data.occupation;
        currentUser.profileImage = data.profileImage;
        currentUser.teamName = data.teamName;
        this.appSessionStorageService.storeCurrentUser(JSON.stringify(currentUser));
        let redirectUrl = this.route.snapshot.queryParamMap.get('login_redirect');
        if(!redirectUrl) {
          if(currentUser.Role && currentUser.Role.toLowerCase() == "designer"){
            this.router.navigate(['/projects/project-list']);
          }
          else{
            this.router.navigate(['/dashboard']);
          }
        }
        else{
          this.router.navigateByUrl(decodeURIComponent(redirectUrl));
        }
      }
    }
    catch(error){
      this.errorMsg = 'Username or password incorrect.';
      this.isSaving = false;

    }
  }

}
