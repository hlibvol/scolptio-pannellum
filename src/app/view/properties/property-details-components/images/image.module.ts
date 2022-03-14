import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImagesComponent } from './images.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [ImagesComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path:'',
        component : ImagesComponent,
      },
    ]),
  ]
})
export class ImageModule { }
