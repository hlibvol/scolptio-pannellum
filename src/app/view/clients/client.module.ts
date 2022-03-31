import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientAddComponent } from './client-add/client-add.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientDeleteComponent } from './client-delete/client-delete.component';


const maskConfig: Partial<IConfig> = {
  validation: true,
};
@NgModule({
  declarations: [
    ClientListComponent,
    ClientAddComponent,
    ClientEditComponent,
    ClientDeleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forRoot(maskConfig),
    RouterModule.forChild([
      {path:'',component:ClientListComponent}
    ])
  ]
})
export class ClientModule { }
