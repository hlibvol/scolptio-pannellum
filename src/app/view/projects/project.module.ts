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
import { ImagesComponent } from './project-overview/images/images.component';
import { DocumentsComponent } from './project-overview/documents/documents.component';
import { PlayerComponent } from './project-overview/player/player.component';
import { ModelsComponent } from './project-overview/models/models.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from 'src/app/shared/directives/permission.directive';

@NgModule({
  declarations: [
    ProjectAddComponent,
    ProjectEditComponent,
    ProjectListComponent,
    ProjectDeleteComponent,
    ProjectOverviewComponent,
    ImagesComponent,
    DocumentsComponent,
    PlayerComponent,
    ModelsComponent,
    PermissionDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ProjectListComponent },
      { path: 'project-overview/:id', component: ProjectOverviewComponent }
    ]),
    NgSelectModule
  ]
})
export class ProjectModule { }
