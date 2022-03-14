import { NgModule } from '@angular/core';
import { AuthRegisterComponent } from './auth-register.component';
import { Route, RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthRegisterService } from './auth-register.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AuthRegisterComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  providers: [AuthRegisterService]
})
export class AuthRegisterModule { }
