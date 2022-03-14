import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeamAddComponent } from './team-add/team-add.component';
import { TeamDeleteComponent } from './team-delete/team-delete.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamService } from './team.service';
import { QuillModule } from 'ngx-quill';
import { UserRolesAddComponent } from './user-roles-add/user-roles-add.component';
import { UserRoleDeleteComponent } from './user-roles-delete/user-roles-delete.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { UserRolesListComponent } from './user-roles-list/user-roles-list.component';

@NgModule({
  declarations: [
    TeamListComponent,
    TeamAddComponent,
    TeamEditComponent,
    TeamDeleteComponent
  ],
  imports: [
    SharedModule,
    QuillModule.forRoot(),
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path:'',
          component : TeamListComponent,
        },
      ]),
  ],
  providers: [TeamService]
})
export class TeamModule { }
