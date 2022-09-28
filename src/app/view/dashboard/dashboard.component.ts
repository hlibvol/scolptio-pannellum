import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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
  selected: {startDate: any, endDate: any};
  alwaysShowCalendars: boolean;
ranges: any = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'This Year': [moment().startOf('year'), moment().endOf('year')]
}
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
      var model = {
        startDate : this.selected && this.selected.startDate ? this.selected.startDate.$d : null,
        endDate : this.selected && this.selected.endDate ?this.selected.endDate.$d : null
      }
      this.dashboard = await this.dashboardService.GetDashboardDetails(model).toPromise();
    }
    catch{
      this.toastr.error(common_error_message)
    }
  }

  choosedDate(event:any){
    if(this.selected && this.selected.endDate && this.selected.endDate.$d== "Invalid Date"){
      this.toastr.error("Please select end date properly");
      return false;
    }
    if(this.selected && this.selected.startDate && this.selected.startDate.$d== "Invalid Date"){
      this.toastr.error("Please select start date properly");
      return false;
    }
        this.GetDashboardDetails();
  }

}
