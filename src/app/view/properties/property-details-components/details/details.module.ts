import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from './details.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetailsComponent,
      },
    ]),
  ]
})
export class DetailsModule { }
