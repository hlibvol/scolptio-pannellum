import { Component, OnDestroy } from '@angular/core';
import { statusList } from 'src/app/shared/project-status.list';
import { Subscription } from 'rxjs';
import { ProjectListInteractionService } from './project-list-interaction.service';
import { ProjectsViewMode, allViewModes } from 'src/app/shared/router-interaction-types';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BroadcasterService } from 'ng-broadcaster';

declare var $: any;
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss', '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})

export class ProjectListComponent implements OnDestroy {

  selectedproject: any;
  selectedUpdatedSubscription: Subscription;
  breadcrumbSubscription: Subscription;
  readonly statusList = statusList;
  projectsViewMode:ProjectsViewMode = allViewModes[0];
  constructor(private _projectListInteractionService: ProjectListInteractionService,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     private broadcaster: BroadcasterService) { 
    this.selectedUpdatedSubscription = this._projectListInteractionService.selectedUpdated.subscribe((newSelected) => {
      this.selectedproject = newSelected;
    })
    this.breadcrumbSubscription = this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe(() => {
      this.handleUrlChange();
    })
  }
  handleUrlChange() {
    this.projectsViewMode = this.activatedRoute.snapshot.firstChild?.routeConfig?.path as ProjectsViewMode || this.projectsViewMode;
    let breadcrumb = [{
      "pathname": "Dashboard",
      "url": '/dashboard'
    }, 
    {
      "pathname": "",
      "url": "/projects/" + this.projectsViewMode
    }]
    if(this.projectsViewMode === 'project-list')
      breadcrumb[1].pathname = "Project List"
    else if(this.projectsViewMode === 'inventory'){
      breadcrumb[1].pathname = "Inventory"
    }
    else
      breadcrumb = null;
    if(breadcrumb)
      this.broadcaster.broadcast('onLogin',breadcrumb);
      
  }
  ngOnDestroy(): void {
    this.selectedUpdatedSubscription.unsubscribe();
    this.breadcrumbSubscription.unsubscribe();
  }
  onListUpdate(){
    this._projectListInteractionService.broadcastListUpdated();
  }
}