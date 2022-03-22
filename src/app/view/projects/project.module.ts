import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { RouterModule } from '@angular/router';
import { ProjectDeleteComponent } from './project-delete/project-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';



@NgModule({
  declarations: [
    ProjectAddComponent,
    ProjectEditComponent,
    ProjectListComponent,
    ProjectDeleteComponent,
    ProjectOverviewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ProjectListComponent },
      { path: '/projects/project-overview', component: ProjectOverviewComponent }
    ])
  ]
})
export class ProjectModule { }
