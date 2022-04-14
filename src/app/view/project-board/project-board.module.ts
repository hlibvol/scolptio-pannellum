import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectBoardAddComponent } from './project-board-add/project-board-add.component';
import { ProjectBoardEditComponent } from './project-board-edit/project-board-edit.component';
import { ProjectBoardListComponent } from './project-board-list/project-board-list.component';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';



@NgModule({
  declarations: [
    ProjectBoardAddComponent,
    ProjectBoardEditComponent,
    ProjectBoardListComponent

  ],
  imports: [
    CommonModule,
    DragulaModule.forRoot(),
    RouterModule.forChild([{
      path: '', component: ProjectBoardListComponent
    }])
  ]
})
export class ProjectBoardModule { }
