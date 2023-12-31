import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';
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
  pageNumber = -1;
  pageSize = -1;
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
    private sharedService: SharedService,
    private dragulaService: DragulaService,
    private projectService: ProjectService) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if (this.currentUser.Role == "Client") {
        this.isHide = false;
        this.dragulaService.createGroup('PROJECT', {
          accepts: (el, target, source, sibling): boolean => {
            return false;
          }
        });
      }
      else if (this.currentUser.Role == "Designer") {
        this.isHide = false;
        this.dragulaService.createGroup('PROJECT', {
          accepts: (el, target, source, sibling): boolean => {
            return false;
          }
        });
      } else if (this.currentUser.Role == "Admin") {
        this.dragulaService.drag("PROJECT")
          .subscribe(({ el }) => {
            let status = el.parentElement.getAttribute("data-target");
            switch (status) {
              case "Planning":
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

        this.dragulaService.cancel("PROJECT")
          .subscribe(({ el }) => {
            let status = el.parentElement.getAttribute("data-target");
            switch (status) {
              case "Planning":
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

        this.dragulaService.drop("PROJECT")
          .subscribe(({ el }) => {
            let status = el.parentElement.getAttribute("data-target");
            switch (status) {
              case "Planning":
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
              case "scroll-up":
              case "scroll-down":
                this.dragulaService.find('PROJECT').drake.cancel(true);
                return;
            }
            let projectId = el.children[0].id;
            let project = this.projectList.find(item => item.id == projectId);
            project.status = status;
            this.projectService.UpdateProject(project).subscribe(res => {
              // this.toastr.info(project_edit.edit_project_success);
            }, error => {
              // this.toastr.info(project_edit.edit_project_error);
            })
          })
          this.dragulaService.over().subscribe((el) => {
            let targetData = el.container.getAttribute("data-target");
            console.log(targetData)
            switch(targetData){
              case 'scroll-up':
                this.sharedService.scrollAdminLayoutBy(0, -200)
                break;
              case 'scroll-down':
                this.sharedService.scrollAdminLayoutBy(0, 200)
                break;
            }
          })
      }
      
    }

  }

  async ngOnInit() {
    this.isLoading = true;
    await this._projectService.GetAllProject(this.pageNumber, this.pageSize, this.searchKey, this.filterObj, this.currentUser.TeamId).subscribe((response: any) => {
      this.isLoading = false;
      this.projectList = response.data;
      this.projectList.map(project => {
        switch (project.status) {
          case "Planning":
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
        if(!project.clientLogo)
          project.clientLogo = '../../../assets/img/dummy-user.png'
      })
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })

  }
  hide(e){
    console.log(e)
  }
}
