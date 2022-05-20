import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss', '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})

export class ProjectListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  projectList: any[];
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
    private router: Router) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if (this.currentUser.Role == "Designer") {
        this.isHide = false;
      }
    }
  }

  ngOnInit(): void {
    this.GetAllproject();
  }

  GetAllproject() {
    this.isLoading = true;
    this._projectService.GetAllProject(this.pageNumber, this.pageSize, this.searchKey, this.filterObj, this.currentUser.TeamId).subscribe((response: any) => {
      this.isLoading = false;
      this.projectList = response.data;
      this.total = response.total;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedproject(project: any) {
    this.selectedproject = {...project};
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllproject();
    }
  }

  onSearchList(event: KeyboardEvent): void {
    if(event.keyCode === 13)
      this.GetAllproject();
  }

  onChange(val) {
    if (this.searchStatus == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchStatus = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.GetAllproject();
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,
    ]
    this.GetAllproject();
  }

  search(event) {
    if (event.keyCode == 13) {
      this.GetAllproject();
    }
  }

  getLogo(logo) {
    return logo + "?v=" + Math.random()
  }

  openProject(project) {
    this.router.navigate(['/projects/project-overview/' + project.id]);
  }

  openQuestionnaire(project, segment: string): void {
    this.router.navigate([`/projects/project-questionnaire/${segment}/${project.id}`]);
  }
}
