import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordService } from './forgot-password.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  providers: [ForgotPasswordService]
})
export class ForgotPasswordModule { }
