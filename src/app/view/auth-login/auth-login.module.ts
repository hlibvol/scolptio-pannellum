import { NgModule } from '@angular/core';
import { AuthLoginComponent } from './auth-login.component';
import { AuthLoginService } from './auth-login.service';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AuthLoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  providers: [AuthLoginService]
})
export class AuthLoginModule { }
