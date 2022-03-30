import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss',
    '../../../../assets/css/app.css',]
})
export class UserListComponent implements OnInit {

  isLoading = false;
  userList: User[];
  finaluserList: User[];
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  selectedUser: User;
  searchKey: '';
  filterObj: any;
  searchName = '';
  searchEmail = '';
  searchPhone = '';
  visibleFilter = false;
  currentUser:AppUser;
  constructor(private userService: UserService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
    this.selectedUser = new User();
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.GetUserTotalCount();
  }

  GetUserTotalCount() {
    this.isLoading = true;
    this.userService.GetUserTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAll();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetAll() {
    this.isLoading = true;
    this.userService.GetUsersInformationByOrg(this.pageNumber, this.pageSize, this.searchKey, this.filterObj,this.currentUser.TeamId).subscribe((data: any[]) => {
      this.isLoading = false;
      this.userList = this.finaluserList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }
  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAll();
    }
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  clearFilter() {
    this.searchName = '';
    this.searchEmail = '';
    this.searchPhone = '';
    this.filterObj = ['', '', ''];
    this.visibleFilter = false;
    this.GetAll();
  }

  onChange(val) {
    if (this.searchName == '' && this.searchEmail == '' && this.searchPhone == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  actionFilter() {
    this.filterObj = [
      this.searchName,  
      this.searchEmail,
      this.searchPhone,
    ]
    this.GetAll();
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.userList = this.finaluserList.filter(x => (x.displayName != null && x.displayName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) || (x.email != null && x.email.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) || (x.phoneNumber != null && x.phoneNumber.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.userList = this.finaluserList;
  }


  search(event) {
    if(event.keyCode == 13) {
      this.GetAll();
    }
  }

}
