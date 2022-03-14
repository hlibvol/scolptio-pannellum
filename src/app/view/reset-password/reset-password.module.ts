import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordService } from './reset-password.service';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [ResetPasswordService]
})
export class ResetPasswordModule { }
