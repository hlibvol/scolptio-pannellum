import { Component,  HostListener,  Input,  OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BroadcasterService } from 'ng-broadcaster';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { ProjectService } from '../project.service';
import { permission } from 'src/app/shared/directives/permission';
import { allViewModes, ProjectsViewMode } from 'src/app/shared/router-interaction-types';
import { SharedService } from 'src/app/services/shared.service';
import { ProjectDetailsModules } from './project-overview.model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  id: string = ''
  activeSectionIndex: number = 0;
  activeModuleKey: string = "Floor-Plans"
  currentUser:AppUser;
  readonly modules: ProjectDetailsModules = {
    'Floor-Plans': {
      sections: [
        {
          key: "ProjectDescription",
          label: 'Project Description',
          component: 'notes'
        },
        {
          key: "HandSketchesAndDrawings",
          label: 'Hand Sketches/drawings',
          component: 'images'
        },
        {
          key: "CADDrawings",
          label: 'CAD Drawings',
          component: 'documents'
        },
        {
          key: "OtherReferences",
          label: 'Other References',
          component: 'documents'
        }
      ],
      showInModes: allViewModes,
      label: 'Floor Plans',
      expanded: false
    },
    'Photos': {
      sections: [
        {
          key: "CurrentPhotos",
          label: 'Current Photos',
          component: 'images'
        },
        {
          key: "ReferencePhotos",
          label: 'Reference Photos',
          component: 'images'
        },
        {
          key: "ReferenceVideos",
          label: 'Reference Videos',
          component: 'videos'
        },
      ],
      showInModes: allViewModes,
      label: 'Photos',
      expanded: false
    },
    '3D-Model': {
      sections: [
        {
          key: "PrerenderedPhotos",
          label: 'Pre-rendered Photos',
          component: 'images'
        },
        {
          key: "RenderedPhotos",
          label: 'Rendered Photos',
          component: 'images'
        },
        {
          key: "VideosOrAnimations",
          label: 'Videos/Animations',
          component: 'videos'
        },
        {
          key: "3DModelViewer",
          label: '3D/AR Model Viewer',
          component: 'models'
        },
        {
          key: "SourceFiles",
          label: 'All Source Files',
          component: 'documents'
        }
      ],
      showInModes: ['project-list'],
      label: '3D Models',
      expanded: false
    }
  }
  projectsViewMode:ProjectsViewMode = allViewModes[0];
  constructor(private projectService: ProjectService,
    private broadcaster: BroadcasterService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private appSessionStorageService: AppSessionStorageService,
    private sharedService: SharedService,
    private router: Router) {
    this.activatedRoute.params.subscribe((params) => {
      this.initProjectViewMode(params);
      this.initBreadcrumb(params);
      this.initSection(params);
    })
  }
  initSection(params: Params) {
    const currentUser = this.appSessionStorageService.getCurrentUser()
    if(!currentUser)
      this.sharedService.broadcastReloadUserInformation();
    else
      this.currentUser = JSON.parse(currentUser) as AppUser;
    let allowedItems = permission.permission.filter(item => item.show && item.role === this.currentUser.Role.toLocaleLowerCase() && this.modules[item.module] && this.modules[item.module].sections.some(section => section.key === item.action))
    if(!allowedItems.length){
      this.router.navigate(['dashboard'])
      return;
    }
    let itemToShow = allowedItems[0];
    if(params['section']) {
      itemToShow = allowedItems.find(x => x.action === params['section'])
      if(!itemToShow)
        itemToShow = allowedItems[0];
      this.showSection(itemToShow.action, itemToShow.module)
    }
    else {
      this.router.navigate(['/projects/project-overview', this.id, this.projectsViewMode, itemToShow.action]);
    }
  }
  initBreadcrumb(params: Params) {
    if (params['id']) {
      this.id = params['id'];
      this.projectService.GetById(this.id).subscribe(res => {
         var breadcumb = [
            {"pathname": "Dashboard",
            "url": '/dashboard'},
            {"pathname": "Projects",
            "url": "/projects/project-list"
            },
            {"pathname": "Project-overview",
            "url": "javascript:void(0)"
            },
            {"pathname": res.projectName,
            "url": "javascript:void(0)"
            },

         ]
         this.broadcaster.broadcast('onLogin',breadcumb);
      })
      
    }
    else
      this.toastr.error('Something went wrong. Please try again later.');
  }
  initProjectViewMode(params: Params) {
    this.projectsViewMode = params['projectsViewMode'] || this.projectsViewMode;
  }

  ngOnInit(): void {
    this.expandAccordion();
  }
  @HostListener('window:resize')
  refreshAccordion(): void {
    var accordionMode:boolean = window.innerWidth < 768;
    for(let key in this.modules)
      this.modules[key].expanded = !accordionMode
  }
  showSection(section: string, module: string){
    this.activeModuleKey = module;
    this.activeSectionIndex = this.modules[this.activeModuleKey].sections.findIndex(x => x.key === section);
    this.expandAccordion();
  }
  expandAccordion(moduleKey: string = ''): void {
    if(!moduleKey)
      moduleKey = this.activeModuleKey;
    this.refreshAccordion();
    this.modules[moduleKey].expanded = true;
  }
  get activeSection(){
    return this.modules[this.activeModuleKey].sections[this.activeSectionIndex].key;
  }
  get moduleKeys(): string[]{
    return Object.keys(this.modules);
  }
  moduleByIndex(index: number): string {
    return this.moduleKeys[index];
  }
}
