import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss','../../../../assets/css/app.css',
  '../../../../assets/css/icons.css']
})

export class ProjectListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  projectList: any[];
  finalprojectList: any = [];
  selectedproject: any;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  constructor(private _projectService: ProjectService,
    private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    this.GetprojectTotalCount();
  }

  GetAllproject() {
    this.isLoading = true;
    this._projectService.GetAllProject(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.isLoading = false;
      this.projectList = this.finalprojectList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetprojectTotalCount() {
    this.isLoading = true;
    this._projectService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAllproject();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedproject(project: any) {
    this.selectedproject = project;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllproject();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.projectList = this.finalprojectList.filter(x => x.projectName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      x.clientName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.projectList = this.finalprojectList;
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
    if(event.keyCode == 13) {
      this.GetAllproject();
    }
  }

  getLogo(logo){
    return logo + "?v="+ Math.random()
  }
}