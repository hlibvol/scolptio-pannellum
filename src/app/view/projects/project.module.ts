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
import { TagListComponent } from './tag/tag-list/tag-list.component';
import { TagAddComponent } from './tag/tag-add/tag-add.component';
import { TagEditComponent } from './tag/tag-edit/tag-edit.component';
import { TagDeleteComponent } from './tag/tag-delete/tag-delete.component';
import { TagTypePipe } from 'src/app/shared/pipes/tag-type.pipe';
import { BsModalService } from 'ngx-bootstrap/modal';

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
    PermissionDirective,
    TagListComponent,
    TagAddComponent,
    TagEditComponent,
    TagDeleteComponent,
    TagTypePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'project-list', component: ProjectListComponent },
      { path: 'project-overview/:id', component: ProjectOverviewComponent },
      { path: 'tags', component: TagListComponent }
    ]),
    NgSelectModule
  ],
  providers: [BsModalService]
})
export class ProjectModule { }
