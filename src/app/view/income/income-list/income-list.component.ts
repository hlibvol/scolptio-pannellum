import { Component, OnInit } from '@angular/core';
import { Income } from '../income.model';
import { IncomeService } from '../income.service';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css',]
})
export class IncomeListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  incomeList: Income[];
  finalIncomeList: any = [];
  selectedIncome: Income;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  constructor(private incomeService: IncomeService,
    private toastr: ToastrService) {
    this.selectedIncome = new Income();
  }

  ngOnInit(): void {
    this.GetIncomeTotalCount();
  }

  GetAllIncome() {
    this.isLoading = true;
    this.incomeService.GetAllIncome(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.isLoading = false;
      this.incomeList = this.finalIncomeList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetIncomeTotalCount() {
    this.isLoading = true;
    this.incomeService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAllIncome();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedIncome(income: Income) {
    this.selectedIncome = income;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllIncome();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.incomeList = this.finalIncomeList.filter(x => x.description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.incomeList = this.finalIncomeList;
  }

  onChange(val) {
    if (this.searchStatus == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchStatus = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.GetAllIncome();
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,  
    ]
    this.GetAllIncome();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAllIncome();
    }
  }
}
