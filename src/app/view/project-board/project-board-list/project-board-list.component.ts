import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message, project_edit } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { ProjectService } from '../../projects/project.service';

@Component({
  selector: 'app-project-board-list',
  templateUrl: './project-board-list.component.html',
  styleUrls: ['./project-board-list.component.scss']
})
export class ProjectBoardListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  projectList: any[];
  finalprojectList: any = [];
  planingProjectList: any[] = [];
  planCount = 0;
  cadProjectList: any[] = [];
  cadCount = 0;
  modelProjectList: any[] = [];
  modelCount = 0;
  renderProjectList: any[] = [];
  renderCount = 0;
  completeProjectList: any[] = [];
  completeCount = 0;
  selectedproject: any;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  currentUser: AppUser;
  isHide: boolean = true;


  constructor(private _projectService: ProjectService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private router: Router,
    private dragulaService: DragulaService,
    private projectService: ProjectService) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if (this.currentUser.Role == "Client") {
        this.isHide = false;
      }
      else if (this.currentUser.Role == "Designer") {
        this.isHide = false;
      }
    }
    dragulaService.drag("PROJECT")
      .subscribe(({ el }) => {
        let status = el.parentElement.getAttribute("data-target");
        switch (status) {
          case "Planing":
            this.planCount--;
            break;
          case "CAD Drawing":
            this.cadCount--;
            break;
          case "3D Modeling":
            this.modelCount--;
            break;
          case "Final Rendering":
            this.renderCount--;
            break;
          case "Completed":
            this.completeCount--;
            break;
        }
      })

    dragulaService.cancel("PROJECT")
      .subscribe(({ el }) => {
        let status = el.parentElement.getAttribute("data-target");
        switch (status) {
          case "Planing":
            this.planCount++;
            break;
          case "CAD Drawing":
            this.cadCount++;
            break;
          case "3D Modeling":
            this.modelCount++;
            break;
          case "Final Rendering":
            this.renderCount++;
            break;
          case "Completed":
            this.completeCount++;
            break;
        }
      })

    dragulaService.drop("PROJECT")
      .subscribe(({ el }) => {
        let status = el.parentElement.getAttribute("data-target");

        switch (status) {
          case "Planing":
            this.planCount++;
            break;
          case "CAD Drawing":
            this.cadCount++;
            break;
          case "3D Modeling":
            this.modelCount++;
            break;
          case "Final Rendering":
            this.renderCount++;
            break;
          case "Completed":
            this.completeCount++;
            break;
        }
        let projectId = el.children[1].id;
        let project = this.projectList.find(item => item.id == projectId);
        project.status = status;
        this.projectService.UpdateProject(project).subscribe(res => {
          // this.toastr.info(project_edit.edit_project_success);
        }, error => {
          // this.toastr.info(project_edit.edit_project_error);
        })
      })
  }

  async ngOnInit() {
    this.isLoading = true;
    await this._projectService.GetAllProject(this.pageNumber, this.pageSize, this.searchKey, this.filterObj, this.currentUser.TeamId).subscribe((data: any[]) => {
      this.isLoading = false;
      this.projectList = data;
      this.projectList.map(project => {
        switch (project.status) {
          case "Planing":
            this.planingProjectList.push(project);
            this.planCount++;
            break;
          case "CAD Drawing":
            this.cadProjectList.push(project);
            this.cadCount++;
            break;
          case "3D Modeling":
            this.modelProjectList.push(project);
            this.modelCount++;
            break;
          case "Final Rendering":
            this.renderProjectList.push(project);
            this.renderCount++;
            break;
          case "Completed":
            this.completeProjectList.push(project);
            this.completeCount++;
            break;
        }
      })
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })

  }

}
