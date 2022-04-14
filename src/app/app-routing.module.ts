import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './templates/admin-layout/admin-layout.component';
import { AuthLockscreenComponent } from './view/auth-lockscreen/auth-lockscreen.component';
import { AuthLoginComponent } from './view/auth-login/auth-login.component';
import { AuthRegisterComponent } from './view/auth-register/auth-register.component';
import { EmailVerifyComponent } from './view/email-verify/email-verify.component';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './view/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import('./view/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      // {
      //   path: "properties",
      //   loadChildren: () => import('./view/properties/properties.module').then(m => m.PropertiesModule)
      // },
      // {
      //   path: 'properties/property-details',
      //   loadChildren: () => import('./view/properties/property-detail/property-details.module').then(m => m.PropertyDetailsModule)
      // },
      // {
      //   path: 'properties/settings',
      //   loadChildren: () => import('./view/properties/properties-settings/properties-settings.module').then(m => m.PropertiesSettingsModule)
      // },
      // {
      //   path: 'properties/property-list',
      //   loadChildren: () => import('./view/properties/property-list/property-list.module').then(m => m.PropertyListModule)
      // },
      // {
      //   path: 'properties/property-search',
      //   loadChildren: () => import('./view/properties/property-search/property-serach.module').then(m => m.PropertySerachModule)
      // },
      // {
      //   path: "sales-website",
      //   loadChildren: () => import('./view/sales-website/sales-website.module').then(m => m.SalesWebsiteModule)
      // },

      // {
      //   path: "mailhouse",
      //   loadChildren: () => import('./view/mailhouse/mailhouse.module').then(m => m.MailhouseModule)
      // },
      // {
      //   path: "listing",
      //   loadChildren: () => import('./view/listings/listing.module').then(m => m.ListingModule)
      // },
      {
        path: "account-settings",
        loadChildren: () => import('./view/account-settings/account-settings.module').then(m => m.AccountSettingsModule)
      },
      // {
      //   path: "campaigns",
      //   loadChildren: () => import('./view/campaign/campaign.module').then(m => m.CampaignModule)
      // },
      {
        path: "income",
        loadChildren: () => import('./view/income/income.module').then(m => m.IncomeModule)
      },
      {
        path: "expenditure",
        loadChildren: () => import('./view/expenditure/expenditure.module').then(m => m.ExpenditureModule)
      },
      {
        path: "teams",
        loadChildren: () => import('./view/team/team.module').then(m => m.TeamModule)
      },
      {
        path: "user-roles",
        loadChildren: () => import('./view/team/user-role.module').then(m => m.UserRoleModule)
      },
      {
        path: "users",
        loadChildren: () => import('./view/users/user.module').then(m => m.UserModule)
      },
      // {
      //   path: "documents",
      //   loadChildren: () => import('./view/contract-docs/contract-docs.module').then(m => m.ContractDocsModule)
      // },
      // {
      //   path: "document-templates",
      //   loadChildren: () => import('./view/contract-docs/document-template.module').then(m => m.DocumentTemplateModule)
      // },
      // {
      //   path: "leads-website",
      //   loadChildren: () => import('./view/leads-website/leads-website.module').then(m => m.LeadsWebsiteModule)
      // },
      {
        path: "organizations",
        loadChildren: () => import('./view/organizations/organization.module').then(m => m.OrganizationsModule)
      },
      {
        path: "invitation",
        loadChildren: () => import('./view/invitation/invitation.module').then(m => m.InvitationModule)
      },
      { path: 'clients', loadChildren: () => import('./view/clients/client.module').then(m => m.ClientModule) },
      { path: 'projects', loadChildren: () => import('./view/projects/project.module').then(m => m.ProjectModule) },
      { path: 'projectboard', loadChildren: () => import('./view/project-board/project-board.module').then(m => m.ProjectBoardModule) }

    ]
  },
  // {
  //   path: "properties",
  //   component: PropertyDetailsLayoutComponent,
  //   children: [
  //      { 
  //       path: "", 
  //       loadChildren: () => import('./view/properties/properties.module').then(m => m.propertiesModule)
  //     }, 

  //   ]
  // },
  {
    path: "login", component: AuthLoginComponent
  },
  {
    path: "register", component: AuthLoginComponent
  },
  {
    path: "locked", component: AuthLockscreenComponent
  },
  { path: "verifyemail", component: EmailVerifyComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "resetpassword", component: ResetPasswordComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
