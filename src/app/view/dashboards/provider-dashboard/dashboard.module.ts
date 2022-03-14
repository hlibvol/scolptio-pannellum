import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderDashboardComponent } from './provider-dashboard.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : ProviderDashboardComponent,
      },
    ]),
  ]
})
export class DashboardModule { }
