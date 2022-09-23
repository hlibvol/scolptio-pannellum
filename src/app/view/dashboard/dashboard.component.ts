import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { RouterAction } from '../../shared/router-interaction-types';
import { AppUser } from '../auth-register/auth-register.model';
import { DashboardService } from '../dashboards/dashboard.service';
import { Dashboard } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard;
  public readonly actions: {
    AddNewProject: RouterAction,
    AddNewClient: RouterAction
  } = {
    AddNewProject: 'add-new-project',
    AddNewClient: 'add-new-client'
  }
  currentUser: AppUser;
  isHide: boolean = false;
  constructor( private appSessionStorageService: AppSessionStorageService,private toastr: ToastrService, private dashboardService: DashboardService) { 
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if (this.currentUser.Role == "Designer" || this.currentUser.Role == "Client") {
        this.isHide = true;
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.GetDashboardDetails();
  }
  async GetDashboardDetails(): Promise<void> {
    try{
      this.dashboard = await this.dashboardService.GetDashboardDetails().toPromise();
    }
    catch{
      this.toastr.error(common_error_message)
    }
  }

}
