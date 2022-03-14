import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GisMapsComponent } from './gis-maps.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : GisMapsComponent,
      },
    ]),
  ]
})
export class GisModule { }
