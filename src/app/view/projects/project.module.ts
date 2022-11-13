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
import { UserService } from '../users/user.service';
import { PrepareQuestionnaireComponent } from './project-questionnaire/prepare-questionnaire/prepare-questionnaire.component';
import { FillQuestionnaireComponent } from './project-questionnaire/fill-questionnaire/fill-questionnaire.component';
import { MobileAppBannerComponent } from './project-overview/mobile-app-banner/mobile-app-banner.component';
import { QuestionnairesCompletedPipe } from './project-questionnaire/questionnaires-completed.pipe';
import { SelectedRoomHeaderPipe } from './project-questionnaire/selected-room-header.pipe';
import { NotesComponent } from 'src/app/view/projects/project-overview/notes/notes.component';
import { BroadcasterService } from 'ng-broadcaster';
import { QuillModule } from 'ngx-quill';
import { VideosComponent } from './project-overview/videos/videos.component';
import { S3MultiVideoUploadComponent } from 'src/app/shared/components/s3-multi-video-upload/s3-multi-video-upload.component';
import { VersionComponent } from './version/version.component';
import { ProjectsViewComponent } from './project-list/projects-view/projects-view.component';
import { InventoryViewComponent } from './project-list/inventory-view/inventory-view.component';
import { DueInPipe } from 'src/app/shared/pipes/due-in.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';

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
    TagTypePipe,
    MobileAppBannerComponent,
    PrepareQuestionnaireComponent,
    FillQuestionnaireComponent,
    QuestionnairesCompletedPipe,
    SelectedRoomHeaderPipe,
    NotesComponent,
    VideosComponent,
    S3MultiVideoUploadComponent,
    VersionComponent,
    ProjectsViewComponent,
    InventoryViewComponent,
    DueInPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      { 
        path: '',
        component: ProjectListComponent,
        children: [
          {
            path: 'project-list',
            component: ProjectsViewComponent
          },
          {
            path: 'inventory',
            component: InventoryViewComponent
          }
        ]
      },
      { path: 'project-overview/:id/:projectsViewMode', component: ProjectOverviewComponent },
      { path: 'project-overview/:id/:projectsViewMode/:section', component: ProjectOverviewComponent },
      { path: 'tags', component: TagListComponent },
      { path: 'project-questionnaire/prepare/:id', component: PrepareQuestionnaireComponent },
      { path: 'project-questionnaire/fill/:id', component: FillQuestionnaireComponent },
    ]),
    NgSelectModule,
    QuillModule.forRoot(),
    PopoverModule.forRoot()
  ],
    providers: [BsModalService, UserService, DueInPipe]
})
export class ProjectModule { }
