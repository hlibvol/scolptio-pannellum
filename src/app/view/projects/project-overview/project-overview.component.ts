import { Component,  HostListener,  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadcasterService } from 'ng-broadcaster';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { ProjectService } from '../project.service';
import { permission } from 'src/app/shared/directives/permission';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  id: string = ''
  activeSection:string="ProjectDescription";
  module:string = "Floor-Plans"
  currentUser:AppUser;
  accordionExpandedInfo: boolean[] = [];
  readonly moduleList: string[] = ['Floor-Plans', 'Photos', '3D-Model'];
  readonly sectionList: string[] = [
    "ProjectDescription",
    "HandSketchesAndDrawings",
    "CADDrawings",
    "OtherReferences",
    "CurrentPhotos",
    "ReferencePhotos",
    "ReferenceVideos",
    "PrerenderedPhotos",
    "RenderedPhotos",
    "VideosOrAnimations",
    "3DModelViewer",
    "Source Files"
  ]
  constructor(private projectService: ProjectService, private broadcaster: BroadcasterService,private activatedRoute: ActivatedRoute, private toastr: ToastrService,private appSessionStorageService: AppSessionStorageService,) { 
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      let item = permission.permission.find(x => x.show && x.role === this.currentUser.Role.toLocaleLowerCase() && this.moduleList.includes(x.module) && this.sectionList.includes(x.action))
      this.showSection('HandSketchesAndDrawings', item.module, 0)
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
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
    });
    this.expandAccordion(0);
  }
  @HostListener('window:resize')
  refreshAccordion(): void {
    var accordionMode:boolean = window.innerWidth < 768;
    this.accordionExpandedInfo =  [!accordionMode, !accordionMode, !accordionMode];
  }
  showSection(section: string,module:any, expandIndex: number){
    this.activeSection = section;
    this.module = module;
    this.expandAccordion(expandIndex);
  }
  expandAccordion(expandIndex: number): void {
    this.refreshAccordion();
    this.accordionExpandedInfo[expandIndex] = true;
  }
}
