import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DueDeligenceComponent } from './due-deligence.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : DueDeligenceComponent,
      },
    ]),
  ]
})
export class DueDeligenceModule { }
