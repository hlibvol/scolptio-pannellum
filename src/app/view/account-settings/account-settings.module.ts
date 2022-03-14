import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AccountSettingsComponent } from './account-settings.component';
import { AccountSettingService } from './account-settings.service';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    AccountSettingsComponent
  ],
  imports: [
    SharedModule,
    SignaturePadModule,
    RouterModule.forChild([
      {
        path:'',
        component : AccountSettingsComponent,
      },
    ]),
  ],
  providers: [AccountSettingService]
})
export class AccountSettingsModule { }
