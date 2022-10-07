import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectsViewMode } from 'src/app/shared/router-interaction-types';
import { project_delete, inventory_delete } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../project.service';
declare var $: any;
@Component({
  selector: 'app-project-delete',
  templateUrl: './project-delete.component.html',
  styleUrls: ['./project-delete.component.scss']
})
export class ProjectDeleteComponent {

  @Input() project:any;
  @Input() projectsViewMode:ProjectsViewMode = 'project-list';
  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private _projectService : ProjectService,
    private toastr: ToastrService) {

  }

  delete() {
    this.hasError = false;
    this._projectService.DeleteProject(this.project.id, this.projectsViewMode === 'inventory').subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(this.projectsViewMode === 'inventory' ? inventory_delete.delete_success : project_delete.delete_project_success);
        $('#deleteproject').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(this.projectsViewMode === 'inventory' ? inventory_delete.delete_error : project_delete.delete_project_error);
      this.hasError = false;
    })
  }

}

