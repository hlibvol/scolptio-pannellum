import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserRolesListComponent } from './user-roles-list/user-roles-list.component';
import { TeamAddComponent } from './team-add/team-add.component';
import { TeamDeleteComponent } from './team-delete/team-delete.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamListComponent } from './team-list/team-list.component';
import { UserRolesAddComponent } from './user-roles-add/user-roles-add.component';
import { UserRoleDeleteComponent } from './user-roles-delete/user-roles-delete.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamService } from './team.service';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserRolesListComponent,
    UserRolesAddComponent,
    UserRoleDeleteComponent,
    UserRolesEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserRolesListComponent,
      },
    ]),
  ],
  providers: [TeamService]
})
export class UserRoleModule { }
