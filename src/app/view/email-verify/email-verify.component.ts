import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailVerifyService } from './email-verify.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {

  email: string;
  code: string;
  errorMsg = '';
  isVerifySuccess = false;
  isLoading = true;

  constructor(private emailVerifyService: EmailVerifyService,
    private router: Router,
    private _Activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this._Activatedroute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];
      this.verifyEmail();
    });
  }

  verifyEmail() {
    this.errorMsg = '';
    this.isLoading = true;
    this.emailVerifyService.VerifyEmail(this.code, this.email).subscribe((data: any) => {
      if (data && data.toString() === 'true') {
        this.isVerifySuccess = true;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);

    }, (error) => {
      this.isVerifySuccess = false;
      this.isLoading = false;
    })

  }

}
