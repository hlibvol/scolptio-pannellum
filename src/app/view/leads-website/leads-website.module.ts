import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeadsWebsiteListComponent } from './leads-website-list/leads-website-list.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [LeadsWebsiteListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path:'',
        component : LeadsWebsiteListComponent,
      },
    ]),
  ]
})
export class LeadsWebsiteModule { }
