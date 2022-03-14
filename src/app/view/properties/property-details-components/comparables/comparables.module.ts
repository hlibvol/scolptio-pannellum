import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComparablesComponent } from './comparables.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : ComparablesComponent,
      },
    ]),
  ]
})
export class ComparablesModule { }
