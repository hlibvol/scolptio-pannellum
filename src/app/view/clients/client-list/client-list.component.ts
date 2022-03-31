import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { Income } from '../../income/income.model';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: [
  './client-list.component.scss',
  '../../../../assets/css/app.css',
  '../../../../assets/css/icons.css']
})
export class ClientListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  clientList: any[];
  finalClientList: any = [];
  selectedclient: any;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  currentUser:AppUser;
  constructor(private _clientService: ClientsService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
      if (this.appSessionStorageService.getCurrentUser() != null) {
        this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      }
  }

  ngOnInit(): void {
    this.GetclientTotalCount();
  }

  GetAllclient() {
    this.isLoading = true;
    this._clientService.GetAllClients(this.pageNumber, this.pageSize, this.searchKey, this.filterObj,this.currentUser.ClientId).subscribe((data: any[]) => {
      this.isLoading = false;
      this.clientList = this.finalClientList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetclientTotalCount() {
    this.isLoading = true;
    this._clientService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAllclient();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedclient(client: any) {
    this.selectedclient = client;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAllclient();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.clientList = this.finalClientList.filter(x => x.firstName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      x.lastName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
      x.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.clientList = this.finalClientList;
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
    this.GetAllclient();
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,  
    ]
    this.GetAllclient();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAllclient();
    }
  }

  getLogo(logo){
    return logo + "?v="+ Math.random()
  }
}
