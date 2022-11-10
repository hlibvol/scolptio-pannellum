import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SearchWithSuggestionsComponent } from './shared/components/search-with-suggestions/search-with-suggestions/search-with-suggestions.component';
import { HeaderComponent } from './shared/components/header/header/header.component';
import { BreadcumbComponent } from './shared/components/breadcumb/breadcumb.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar/sidebar.component';
import { AuthLockscreenComponent } from './view/auth-lockscreen/auth-lockscreen.component';
import { AdminLayoutComponent } from './templates/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './templates/auth-layout/auth-layout.component';
import { CampaignAddComponent } from './view/campaign/campaign-add/campaign-add.component';
import { CampaignEditComponent } from './view/campaign/campaign-edit/campaign-edit.component';
import { ContractDocsGenerateComponent } from './view/contract-docs/contract-docs-generate/contract-docs-generate.component';
import { ContractDocsEditComponent } from './view/contract-docs/contract-docs-edit/contract-docs-edit.component';
import { DocumentTemplatesAddComponent } from './view/contract-docs/document-templates-add/document-templates-add.component';
import { DocumentTemplatesEditComponent } from './view/contract-docs/document-templates-edit/document-templates-edit.component';
import { ComparablesComponent } from './view/properties/property-details-components/comparables/comparables.component';
import { LeadsWebsiteEditComponent } from './view/leads-website/leads-website-edit/leads-website-edit.component';
import { LeadsWebsiteAddComponent } from './view/leads-website/leads-website-add/leads-website-add.component';
import { AuthRegisterModule } from './view/auth-register/auth-register.module';
import { AuthLoginModule } from './view/auth-login/auth-login.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { EmailVerifyModule } from './view/email-verify/email-verify.module';
import { AppSessionStorageService } from './shared/session-storage.service';
import { LayoutService } from './shared/layout.service';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountSettingsModule } from './view/account-settings/account-settings.module';
import { ForgotPasswordModule } from './view/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './view/reset-password/reset-password.module';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigsLoaderService } from './services/configs-loader.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { InvoiceListComponent } from './view/invoices/invoice-list/invoice-list.component';
import { InvoiceAddComponent } from './view/invoices/invoice-add/invoice-add.component'
import { PermissionDirective2 } from './shared/directives/permission.directive2';
import { BroadcasterService } from 'ng-broadcaster';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,   
    SearchWithSuggestionsComponent,
    HeaderComponent,
    BreadcumbComponent,
    SidebarComponent,
    AuthLockscreenComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    CampaignAddComponent,
    CampaignEditComponent,
    ContractDocsGenerateComponent,
    ContractDocsEditComponent,
    DocumentTemplatesAddComponent,
    DocumentTemplatesEditComponent,
    ComparablesComponent,
    LeadsWebsiteEditComponent,
    LeadsWebsiteAddComponent,
    AuthLayoutComponent,
    InvoiceListComponent,
    InvoiceAddComponent,
    PermissionDirective2
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    LeafletModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AuthRegisterModule,
    AuthLoginModule,
    EmailVerifyModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info-custom',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
    AccountSettingsModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    NgSelectModule
  ],
  providers: [
    BroadcasterService,
    {
      provide: APP_INITIALIZER, 
      useFactory: appInitializerFactory, 
      deps: [ConfigsLoaderService],
      multi: true
    },
    AppSessionStorageService,
    LayoutService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function appInitializerFactory(configsLoaderService: ConfigsLoaderService) {
  return () => configsLoaderService.loadConfigs(); 
}