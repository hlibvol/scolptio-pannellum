import { Component, OnDestroy } from '@angular/core';
import { statusList } from 'src/app/shared/project-status.list';
import { Subscription } from 'rxjs';
import { ProjectListInteractionService } from './project-list-interaction.service';
import { ProjectsViewMode, allViewModes } from 'src/app/shared/router-interaction-types';
import { ActivatedRoute, Router } from '@angular/router';
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
  detailsOpenedSubscription: Subscription;
  urlSubscription: Subscription;
  readonly statusList = statusList;
  projectsViewMode:ProjectsViewMode = allViewModes[0];
  constructor(private _projectListInteractionService: ProjectListInteractionService,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     private broadcaster: BroadcasterService) { 
    this.selectedUpdatedSubscription = this._projectListInteractionService.selectedUpdated.subscribe((newSelected) => {
      this.selectedproject = newSelected;
    })
    this.detailsOpenedSubscription = this._projectListInteractionService.openDetails.subscribe((item) => {
      this.router.navigate(['/projects/project-overview/', item.id, this.projectsViewMode]);
    })
    this.urlSubscription = this.activatedRoute.url.subscribe(() => {
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
      "url": "/projects/project-list/" + this.projectsViewMode
    }]
    if(this.projectsViewMode === 'project-mode')
      breadcrumb[1].pathname = "Project List"
    else if(this.projectsViewMode === 'inventory-mode'){
      breadcrumb[1].pathname = "Inventory"
    }
    else
      breadcrumb = null;
    if(breadcrumb)
      this.broadcaster.broadcast('onLogin',breadcrumb);
  }
  ngOnDestroy(): void {
    this.selectedUpdatedSubscription.unsubscribe();
    this.detailsOpenedSubscription.unsubscribe();
    this.urlSubscription.unsubscribe();
  }
  onListUpdate(){
    this._projectListInteractionService.broadcastListUpdated();
  }
}
/**
 * - Search feature
   - Update breadcrumb (hide url segment)
   - Retest breadcrumb
   - Resize card
   - Remove add/edit inventory fields
   - Details section image/thumbnail
   - Documentation
 */