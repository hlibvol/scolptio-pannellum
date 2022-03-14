import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertySearchComponent } from './property-search.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PropertySearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : PropertySearchComponent,
      },
    ]),
  ]
})
export class PropertySerachModule { }
