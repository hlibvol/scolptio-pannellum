import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../dashboards/dashboard.service';
import { PropertiesService } from '../properties/properties.service';
import { UserService } from '../users/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListingService } from '../listings/listing.service';
import { IncomeService } from '../income/income.service';
import { ExpenditureService } from '../expenditure/expenditure.service';
import { NgChartjsModule } from 'ng-chartjs';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
const chartAnnotation = ChartAnnotation;

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    NgChartjsModule.registerPlugin([chartAnnotation]),
    RouterModule.forChild([
      {
        path:'',
        component : DashboardComponent,
      },
    ]),
  ],
  providers : [PropertiesService,DatePipe,UserService,ListingService,IncomeService,ExpenditureService  ]
})
export class DashboardModule { }
