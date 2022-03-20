import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProjectAddComponent,
    ProjectEditComponent,
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProjectListComponent }
    ])
  ]
})
export class ProjectModule { }
