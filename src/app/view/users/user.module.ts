import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LastLoginPipe } from 'src/app/shared/pipes/last-login.pipe';
import { SharedModule } from '../../shared/shared.module';
import { ClientAddComponent } from '../clients/client-add/client-add.component';
import { ClientEditComponent } from '../clients/client-edit/client-edit.component';
import { ClientInviteComponent } from '../clients/client-invite/client-invite.component';
import { TeamService } from '../team/team.service';
import { UserAddComponent } from './user-add/user-add.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserDeleteComponent,
    ClientAddComponent,
    ClientEditComponent,
    ClientInviteComponent,
    LastLoginPipe
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path:'',
          component : UserListComponent,
        },
      ])
  ],
  providers: [
    UserService,
    TeamService,
    LastLoginPipe,
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule { }
