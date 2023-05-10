import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss',
    '../../../assets/auth-pages/css/stylesheet.css',
    '../../../assets/auth-pages/vendor/bootstrap/css/bootstrap-grid.css',
    '../../../assets/auth-pages/vendor/font-awesome/css/all.css']
})
export class ResetPasswordComponent implements OnInit {

  email: string;
  errorMsg = '';
  isSaving = false;
  isResetSuccess = false;
  code: string;
  slug: string;
  newPassword: string;
  conPassword: string;

  symbolFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  lowerCaseLetterFormat = /[a-z]/;
  upperCaseLetterFormat = /[A-Z]/
  numberFormat = /[0-9]/;

  constructor(private reserPasswordService: ResetPasswordService,
    private _Activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this._Activatedroute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
      this.slug = params['slug'];
    });
  }

  submit() {
    if (this.email == null || this.code == null || this.slug == null) {
      this.errorMsg = 'Invalid link. Please try with a vaild link.';
    } else {
      this.errorMsg = '';
      this.isSaving = true;
      this.reserPasswordService.ResetPassword(this.email, this.code, this.slug, this.newPassword).subscribe((data: any) => {
        this.isResetSuccess = data;
        this.isSaving = false;
      }, (error) => {
        this.errorMsg = 'Something went wrong. Please try again later.';
        this.isSaving = false;
        this.isResetSuccess = false;
      })
    }

  }

  hasSymbol(text: string) {
    return this.symbolFormat.test(text);
  }

  hasLowerCaseLetter(text: string) {
    return this.lowerCaseLetterFormat.test(text);
  }

  hasUpperCaseLetter(text: string){
    return this.upperCaseLetterFormat.test(text);
  }

  hasNumber(text: string) {
    return this.numberFormat.test(text);
  }

  showPassword(id: string) {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el && el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }

}
