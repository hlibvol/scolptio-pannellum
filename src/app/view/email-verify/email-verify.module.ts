import { NgModule } from '@angular/core';
import { EmailVerifyService } from './email-verify.service';
import { SharedModule } from '../../shared/shared.module';
import { EmailVerifyComponent } from './email-verify.component';

@NgModule({
  declarations: [
    EmailVerifyComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [EmailVerifyService]
})
export class EmailVerifyModule { }
