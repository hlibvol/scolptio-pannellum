import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { expenditure_add, income_add, listings_add, property_import } from 'src/app/shared/toast-message-text';
import { AppUser } from '../auth-register/auth-register.model';
import { DashboardService } from '../dashboards/dashboard.service';
import { PropertiesService } from '../properties/properties.service';
import { User } from '../users/user.model';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true,
    legend: { display: !1 },
    scales: { xAxes: [{ ticks: { fontSize: "11", fontColor: "#969da5" }, gridLines: { color: "rgba(0,0,0,0.05)", zeroLineColor: "rgba(0,0,0,0.05)" } }], yAxes: [{ display: !1, ticks: { beginAtZero: !0, max: 65 } }] },
  };
  lineChartLegend = true;
  lineChartType = 'line';

  currentUser: AppUser;
  startDate: any = "";
  endDate: any = "";
  selectedOption: any = "all";

  propertiesCount: any;
  propertiesCountCompare: any;
  propertiesloader: boolean = false;
  propertiesCountIsLow: boolean = true;
  propertiesCountPercentage: any = 0;
  isPropertiesAnimationFirstTimePgaeLoad: boolean = true;

  incomeCount: any;
  incomeCountCompare: any;
  incomeloader: boolean = false;
  incomeCountIsLow: boolean = true;
  incomeCountPercentage: any = 0;
  isincomeAnimationFirstTimePgaeLoad: boolean = true;

  expenditureCount: any;
  expenditureCountCompare: any;
  expenditureloader: boolean = false;
  expenditureCountIsLow: boolean = true;
  expenditureCountPercentage: any = 0;
  isexpenditureAnimationFirstTimePgaeLoad: boolean = true;

  totalCampaignCount: any;
  totalCampaignCountCompare: any;
  totalCampaignloader: boolean = false;
  totalCampaignCountIsLow: boolean = true;
  totalCampaignCountPercentage: any = 0;
  istotalCampaignAnimationFirstTimePgaeLoad: boolean = true;

  activeCampaignCount: any;
  activeCampaignCountCompare: any;
  activeCampaignloader: boolean = false;
  activeCampaignCountIsLow: boolean = true;
  activeCampaignCountPercentage: any = 0;
  isactiveCampaignAnimationFirstTimePgaeLoad: boolean = true;

  completedCampaignCount: any;
  completedCampaignCountCompare: any;
  completedCampaignloader: boolean = false;
  completedCampaignCountIsLow: boolean = true;
  completedCampaignCountPercentage: any = 0;
  iscompletedCampaignAnimationFirstTimePgaeLoad: boolean = true;

  orderCount: any;
  orderCountCompare: any;
  orderloader: boolean = false;
  orderCountIsLow: boolean = true;
  orderCountPercentage: any = 0;
  isorderAnimationFirstTimePgaeLoad: boolean = true;
  totalOrderCount: any;

  get netProfitInpercentage() {
    if ((this.incomeCount == 0 && this.expenditureCount == 0) || (this.incomeCount == 0))
      return 0;
    return (this.incomeCount - this.expenditureCount) / this.incomeCount
  }
  get PreviousNetprofitInPercentage() {
    if (this.incomeCountCompare == 0 && this.expenditureCountCompare == 0)
      return 0;
    return (this.incomeCountCompare - this.expenditureCountCompare) / this.incomeCountCompare
  }

  get netProfitCountIsLow() {
    if (this.incomeCountCompare == 0 && this.expenditureCount == 0)
      return 0;
    return this.incomeCountCompare > this.expenditureCountCompare ? 1 : 2;
  }

  isLoading = false;
  searchText: string = "";
  userList: User[];
  constructor(private appSessionStorageService: AppSessionStorageService, private toastr: ToastrService, private userService: UserService, private _properties: PropertiesService, private datePipe: DatePipe, private dashboard: DashboardService) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.refreshTiles();
    this.GetAllUser();
    this.GetAllOrders();
  }

  chartClicked(e: any): void {
    console.log('click', e);
  }

  chartHovered(e: any): void {
    console.log('hover', e);
  }

  changeChartType() {
    if (this.lineChartType === 'line') {
      this.lineChartType = 'bar';
    } else {
      this.lineChartType = 'line';
    }
  }

  changeChartLabel() {
    this.lineChartLabels = ['1', '2', '3', '4', '5', '6', '7'];
  }

  refreshTiles() {
    this.getPropertiesCountByDate();
    this.getIconeCountByDate();
    this.getExpenditureByDate();
    this.getTotalCampaign();
    this.getActiveCampaign();
    this.getCompletedCampaign();
  }

  getPropertiesCount() {
    this._properties.GetTotalCount().subscribe(res => {
      this.propertiesCount = res;
    })
  }

  getPropertiesCountByDate() {
    this.propertiesloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'PropertyLeads'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.propertiesCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'PropertyLeads'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.propertiesCountCompare = res;
          if (this.propertiesCountCompare && this.propertiesCountCompare > 0) {
            let properties = this.propertiesCount - this.propertiesCountCompare;
            this.propertiesCountPercentage = (properties / this.propertiesCountCompare);
            this.propertiesCountIsLow = this.propertiesCountCompare > this.propertiesCount ? true : false;
          }
          else {
            this.propertiesCountPercentage = 0;
          }
          this.propertiesloader = false;
          this.isPropertiesAnimationFirstTimePgaeLoad = false;
        });
      }
      this.propertiesloader = false;
      this.isPropertiesAnimationFirstTimePgaeLoad = false;
    })
  }

  getIconeCountByDate() {
    this.incomeloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'Income'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.incomeCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'Income'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.incomeCountCompare = res;
          if (this.incomeCountCompare && this.incomeCountCompare > 0 && this.incomeCount > 0) {
            let incomeValue = this.incomeCount - this.incomeCountCompare;
            this.incomeCountPercentage = (incomeValue / this.incomeCountCompare);
            this.incomeCountIsLow = this.incomeCountCompare > this.incomeCount ? true : false;
          }
          else {
            this.incomeCountPercentage = 0;
          }
          this.incomeloader = false;
          this.isincomeAnimationFirstTimePgaeLoad = false;
        });
      }
      this.incomeloader = false;
      this.isincomeAnimationFirstTimePgaeLoad = false;
    })
  }

  getExpenditureByDate() {
    this.expenditureloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'Expense'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.expenditureCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'Expense'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.expenditureCountCompare = res;
          if (this.expenditureCountCompare && this.expenditureCountCompare > 0 && this.expenditureCount > 0) {
            let expense = this.expenditureCount - this.expenditureCountCompare;
            this.expenditureCountPercentage = (expense / this.expenditureCountCompare);
            this.expenditureCountIsLow = this.expenditureCountCompare > this.expenditureCount ? true : false;
          }
          else {
            this.expenditureCountPercentage = 0;
          }
          this.expenditureloader = false;
          this.isexpenditureAnimationFirstTimePgaeLoad = false;
        });
      }
      this.expenditureloader = false;
      this.isexpenditureAnimationFirstTimePgaeLoad = false;

    })
  }

  getTotalCampaign() {
    this.totalCampaignloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'total-campagin'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.totalCampaignCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'total-campagin'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.totalCampaignCountCompare = res;
          if (this.totalCampaignCountCompare && this.totalCampaignCountCompare > 0) {
            let campagin = this.totalCampaignCount - this.totalCampaignCountCompare;
            this.totalCampaignCountPercentage = (campagin / this.totalCampaignCountCompare);
            this.totalCampaignCountIsLow = this.totalCampaignCountCompare > this.totalCampaignCount ? true : false;
          }
          else {
            this.totalCampaignCountPercentage = 0;
          }
          this.totalCampaignloader = false;
          this.istotalCampaignAnimationFirstTimePgaeLoad = false;
        });
      }
      this.totalCampaignloader = false;
      this.istotalCampaignAnimationFirstTimePgaeLoad = false;

    })
  }

  getActiveCampaign() {
    this.activeCampaignloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'active-campagin'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.activeCampaignCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'active-campagin'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.activeCampaignCountCompare = res;
          if (this.activeCampaignCountCompare && this.activeCampaignCountCompare > 0) {
            let activeCampaign = this.activeCampaignCount - this.activeCampaignCountCompare;
            this.activeCampaignCountPercentage = (activeCampaign / this.activeCampaignCountCompare);
            this.activeCampaignCountIsLow = this.activeCampaignCountCompare > this.activeCampaignCount ? true : false;
          }
          else {
            this.activeCampaignCountPercentage = 0;
          }
          this.activeCampaignloader = false;
          this.isactiveCampaignAnimationFirstTimePgaeLoad = false;
        });
      }
      this.activeCampaignloader = false;
      this.isactiveCampaignAnimationFirstTimePgaeLoad = false;

    })
  }

  getCompletedCampaign() {
    this.completedCampaignloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'completed-campagin'
    }
    this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
      this.completedCampaignCount = res;
      if (this.selectedOption != "all") {
        let previousDate = this.getPreviousDate(this.selectedOption);
        let props: any = {
          StartDateString: previousDate.startDate,
          EndDateString: previousDate.endDate,
          sectionName: 'completed-campagin'
        }
        this.dashboard.GetTotalCountbyDate(props).subscribe(res => {
          this.completedCampaignCountCompare = res;
          if (this.completedCampaignCountCompare && this.completedCampaignCountCompare > 0) {
            let completedCampaign = this.completedCampaignCount - this.completedCampaignCountCompare;
            this.completedCampaignCountPercentage = (completedCampaign/ this.completedCampaignCountCompare);
            this.completedCampaignCountIsLow = this.completedCampaignCountCompare > this.completedCampaignCount ? true : false;
          }
          else {
            this.completedCampaignCountPercentage = 0;
          }
          this.completedCampaignloader = false;
          this.iscompletedCampaignAnimationFirstTimePgaeLoad = false;
        });
      }
      this.completedCampaignloader = false;
      this.iscompletedCampaignAnimationFirstTimePgaeLoad = false;

    })
  }

  filterChange(event, isChart: boolean = true) {
    let currentDate = new Date();
    switch (event) {
      case 'all':
        this.startDate = "";
        this.endDate = ""
        this.selectedOption = "all";
        break;
      case 'today':
        this.startDate = this.datePipe.transform(new Date(), "MM/dd/yyyy");
        this.endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() + 1), "MM/dd/yyyy");
        this.selectedOption = "today";
        break;
      case 'week':
        this.startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 7), "MM/dd/yyyy");
        this.endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() + 1), "MM/dd/yyyy");
        this.selectedOption = "week";
        break;
      case 'biweekly':
        this.startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 14), "MM/dd/yyyy");
        this.endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() + 1), "MM/dd/yyyy");
        this.selectedOption = "biweekly";
        break;
      case 'month':
        currentDate = new Date();
        this.startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 30), "MM/dd/yyyy");
        this.endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() + 1), "MM/dd/yyyy");
        this.selectedOption = "month";
        break;
      case 'year':
        currentDate = new Date();
        this.startDate = this.datePipe.transform(new Date().setFullYear(currentDate.getFullYear() - 1), "MM/dd/yyyy");
        this.endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() + 1), "MM/dd/yyyy");
        this.selectedOption = "year";
        break;
    }
    if (!isChart)
      this.refreshTiles();
    else
      this.GetAllOrders();
  }

  getPreviousDate(selectedOption) {
    let startDate: any;
    let endDate: any;
    let currentDate = new Date();
    switch (selectedOption) {
      case 'today':
        startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 1), "MM/dd/yyyy");
        endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate()), "MM/dd/yyyy");
        break;
      case 'week':
        currentDate = new Date();
        startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 14), "MM/dd/yyyy");
        endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 8), "MM/dd/yyyy");
        break;
      case 'month':
        currentDate = new Date();
        startDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 61), "MM/dd/yyyy");
        endDate = this.datePipe.transform(new Date().setDate(currentDate.getDate() - 29), "MM/dd/yyyy");
        break;
    }
    return { startDate: startDate, endDate: endDate };
  }
  change(event: any) {
    this.searchText = event.target.value;
    this.GetAllUser();
  }

  GetAllUser() {
    this.isLoading = true;
    this.userService.GetUsersInformationByOrg(1, 5, this.searchText, null).subscribe((data: any[]) => {
      this.isLoading = false;
      this.userList = data;
    }, (error) => {
      this.isLoading = false;
    })
  }

  GetAllOrders() {
    this.orderloader = true;
    let props: any = {
      StartDateString: this.startDate,
      EndDateString: this.endDate,
      sectionName: 'chart'
    }
    this.dashboard.getAllOrders(props).subscribe(res => {
      debugger;
      if (res && res.countsArray) {
        this.totalOrderCount = res.countsArray.reduce((count, current) => count + current, 0);
        this.lineChartData = [];
        this.lineChartData.push(
          {
            label: "Visitors Graph",
            fill: !1,
            lineTension: 0.3,
            backgroundColor: "#fff",
            borderColor: "#047bf8",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0,
            borderJoinStyle: "miter",
            pointBorderColor: "#fff",
            pointBackgroundColor: "#141E41",
            pointBorderWidth: 3,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "#FC2055",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 3,
            pointRadius: 5,
            pointHitRadius: 10,
            data: res.countsArray,
            spanGaps: !1,
          },
        );
      }
      else {
        this.lineChartData = [];
      }
      if (res && res.datesArray) {
        this.lineChartLabels = [];
        this.lineChartLabels = res.datesArray;
      }
      else {
        this.lineChartLabels = [];
      }
      this.orderloader = false;
      this.isorderAnimationFirstTimePgaeLoad = false;

    })
  }

  GetUserOrganizationTotalCount() {
    this.toastr.success(property_import.import_success);
    this.getPropertiesCountByDate();
  }
  getList() {
    this.toastr.success(listings_add.add_list_success);
  }
  GetIncomeTotalCount() {
    this.toastr.success(income_add.add_income_success);
    this.getIconeCountByDate();
  }
  GetExpenditureTotalCount() {
    this.toastr.success(expenditure_add.add_expenditure_success);
    this.getExpenditureByDate();
  }
}
