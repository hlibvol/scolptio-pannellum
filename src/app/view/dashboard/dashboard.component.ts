import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddNewClient, AddNewProject } from '../../shared/router-interaction-constants';
import { DashboardService } from '../dashboards/dashboard.service';
import { Dashboard } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard;
  public readonly actions = {
    AddNewProject,
    AddNewClient
  }
  constructor(private toastr: ToastrService, private dashboardService: DashboardService) { }

  async ngOnInit(): Promise<void> {
    this.GetDashboardDetails();
  }
  async GetDashboardDetails(): Promise<void> {
    this.dashboard = await this.dashboardService.GetDashboardDetails().toPromise();
  }

}
