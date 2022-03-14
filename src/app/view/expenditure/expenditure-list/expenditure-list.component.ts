import { Component, OnInit } from '@angular/core';
import { Expenditure } from '../expenditure.model';
import { ExpenditureService } from '../expenditure.service';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';

@Component({
  selector: 'app-expenditure-list',
  templateUrl: './expenditure-list.component.html',
  styleUrls: ['./expenditure-list.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css',]
})
export class ExpenditureListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  expenditureList: Expenditure[];
  finalexpenditureList: any = [];
  selectedExpenditure: Expenditure;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  constructor(private expenditureService: ExpenditureService,
    private toastr: ToastrService) {
    this.selectedExpenditure = new Expenditure();
  }

  ngOnInit(): void {
    this.GetExpenditureTotalCount();
  }

  GetAllExpenditure() {
    this.isLoading = true;
    this.expenditureService.GetAllExpenditure(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.isLoading = false;
      this.expenditureList = this.finalexpenditureList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetExpenditureTotalCount() {
    this.isLoading = true;
    this.expenditureService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAllExpenditure();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedExpenditure(expenditure: Expenditure) {
    this.selectedExpenditure = expenditure;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllExpenditure();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.expenditureList = this.finalexpenditureList.filter(x => x.description.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.expenditureList = this.finalexpenditureList;
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
    this.GetAllExpenditure();
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,  
    ]
    this.GetAllExpenditure();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAllExpenditure();
    }
  }

}
