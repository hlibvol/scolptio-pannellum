  
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MailhouseListComponent } from './mailhouse-list/mailhouse-list.component';
import { SharedModule } from '../../shared/shared.module';
import { MailhouseService } from './mailhouse.service';
import { MailhouseAddComponent } from './mailhouse-add/mailhouse-add.component';
import { MailhouseEditComponent } from './mailhouse-edit/mailhouse-edit.component';
import { MailhouseDeleteComponent } from './mailhouse-delete/mailhouse-delete.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    MailhouseListComponent,
    MailhouseAddComponent,
    MailhouseEditComponent,
    MailhouseDeleteComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        {
          path: '',
          component: MailhouseListComponent,
        },
      ]),
  ],
  providers: [MailhouseService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MailhouseModule { }