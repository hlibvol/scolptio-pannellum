import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AddNewProject } from '../../../shared/router-interaction-constants';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { ProjectService } from '../project.service';

declare var $: any;
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
  visibleFilter = false;
  currentUser: AppUser;
  searchStatuses: NgOption[] = [];
  searchTypes: NgOption[] = []
  defaultDisplayStyle: string = 'table-cell'
  readonly statusList: NgOption[] = [
    {
      label: 'Planning',
      value: "Planning"
    },
    {
      label: 'CAD Drawing',
      value: "CAD Drawing"
    },
    {
      label: '3D Modeling',
      value: "3D Modeling"
    },
    {
      label: 'Final Rendering',
      value: "Final Rendering"
    },
    {
      label: 'Completed',
      value: "Completed"
    },
    {
      label: 'Construction Plans',
      value: 'Construction Plans'
    }
  ]
  readonly typeList: NgOption[] = [ // TO-DO: Refactor - create a single type for this
    { 
      value: '0',
      label: 'Architectural Drawings'
    },
    { 
      value: '1',
      label: 'Interior 3D Design'
    },
    { 
      value: '2',
      label: 'Exterior 3D Design'
    },
    { 
      value: '3',
      label: 'Pool - 2D layout'
    },
    { 
      value: '4',
      label: 'Pool - 3D rendering'
    },
    { 
      value: '5',
      label: 'Pool - Architectural Drawings'
    }
  ] 
  constructor(private _projectService: ProjectService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private router: Router) { 
      if (this.appSessionStorageService.getCurrentUser() != null) {
        this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      }
    }

  async ngOnInit(): Promise<void> {
    if(history?.state?.data === AddNewProject)
      $('#addproject').modal('toggle')
    await this.GetAllproject();
  }

  async GetAllproject(): Promise<void> {
    this.isLoading = true;
    try {
      var statuses = this.searchStatuses.map(x => x.value as string);
      if (statuses.length)
        this.visibleFilter = true;
      else
        this.visibleFilter = false;
      const searchStatuses = this.searchStatuses.map(x => x.value as string);
      const searchTypes = this.searchTypes.map(x => x.value as string);
      let response: any = await this._projectService.GetAllProject(this.pageNumber, this.pageSize, this.searchKey, searchStatuses, this.currentUser.TeamId, searchTypes).toPromise();
      this.projectList = response.data;
      this.total = response.count;
    }
    catch {
      this.toastr.error(common_error_message);
    }
    finally {
      this.isLoading = false;
    }
  }

  setSelectedproject(project: any) {
    this.selectedproject = { ...project };
  }

  async onPaginationChange(pageNumber: string): Promise<void> {
    const selectedPage = Number(pageNumber);
    if (!isNaN(selectedPage)) {
      this.pageNumber = selectedPage;
      await this.GetAllproject();
    }
  }

  async onSearchList(event: KeyboardEvent): Promise<void> {
    if (event.keyCode === 13)
      await this.GetAllproject();
  }

  async clearFilter(): Promise<void> {
    this.searchStatuses = [];
    this.visibleFilter = false;
    await this.GetAllproject();
  }

  getLogo(logo) {
    return logo + "?v=" + Math.random()
  }

  openProject(project) {
    this.router.navigate(['/projects/project-overview/' + project.id]);
  }

  openQuestionnaire(project: any, segment: string): void {
    this.router.navigate([`/projects/project-questionnaire/${segment}/${project.id}`]);
  }

  getProjectType(type: any) {
    switch (type) {
      case "0":
        return "Architectural Drawings"
      case "1":
        return "Interior 3D Design";
      case "2":
        return "Exterior 3D Design";
      case "3":
        return "Pool - 2D layout";
      case "4":
        return "Pool - 3D rendering";
      case "5":
        return "Pool - Architectural Drawings";
    }
  }
}
