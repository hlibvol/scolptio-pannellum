import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { project_delete } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../project.service';
declare var $: any;
@Component({
  selector: 'app-project-delete',
  templateUrl: './project-delete.component.html',
  styleUrls: ['./project-delete.component.scss']
})
export class ProjectDeleteComponent implements OnInit {

  @Input() project:any;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private _projectService : ProjectService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this._projectService.DeleteProject(this.project.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(project_delete.delete_project_success);
        $('#deleteproject').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(project_delete.delete_project_error);
      this.hasError = false;
    })
  }

}

