import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss',
    '../../../assets/auth-pages/css/stylesheet.css',
    '../../../assets/auth-pages/vendor/bootstrap/css/bootstrap-grid.css',
    '../../../assets/auth-pages/vendor/font-awesome/css/all.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string;
  errorMsg = '';
  isSaving = false;
  isSentEmailSuccess = false;
  constructor(private forgotPasswordService: ForgotPasswordService,
    private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    this.errorMsg = '';
    this.isSaving = true;
    this.forgotPasswordService.ForgotPassword(this.email).subscribe((data: any) => {
      this.isSentEmailSuccess = data;
      this.isSaving = false;
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isSaving = false;
      this.isSentEmailSuccess = false;
    })

  }

}
