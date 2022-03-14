import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { User } from './auth-register.model';
import { AuthRegisterService } from './auth-register.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss',
    '../../../assets/auth-pages/css/stylesheet.css',
    '../../../assets/auth-pages/vendor/bootstrap/css/bootstrap-grid.css',
    '../../../assets/auth-pages/vendor/font-awesome/css/all.css']
})
export class AuthRegisterComponent implements OnInit {
  appUser: User;
  errorMsg: string;
  termsAccept = false;
  isSaving = false;
  isExist = false;
  isParamsAvaliable= false;
  isRegistrationSuccess = false;
  emailPattern = /^\w+([-+.'#\w+])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  constructor(private authRegisterService: AuthRegisterService,
    private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.appUser = new User();
      this.activatedRoute.queryParams.subscribe(params => {       
        this.appUser.organizationTitle = params['orgName'];  
        this.appUser.email = params['email']; 
        if(params['orgName']!=undefined && params['email'] != undefined){
           this.isParamsAvaliable =true;
        }
      });
    
  }


  ngOnInit(): void {
  }

  save() {
    this.errorMsg = '';
    if (this.appUser.confirmPassword === this.appUser.password) {
      this.isSaving = true;
      this.appUser.profileImageUrl = 'url';
      this.appUser.userCreationDate = new Date().toISOString();
      debugger;
      this.authRegisterService.Register(this.appUser).subscribe((data: any[]) => {
        this.isSaving = false;
        this.isRegistrationSuccess = true;
      }, (error) => {
        this.errorMsg = error;
        this.isSaving = false;
      })
    } else {
      this.errorMsg = "Password didn't match";
    }
  }

  isEmailExist() {

    if (this.appUser.email.match(this.emailPattern)) {
      this.isExist = false;
      this.isSaving = true;
      this.authRegisterService.isEmailExist(this.appUser.email).subscribe((data: any) => {
        this.isExist = data;
        this.isSaving = false;
      }, (error) => {
        this.errorMsg = error;
        this.isSaving = false;
      })
    }
  }

}
