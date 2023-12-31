import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RouterAction } from 'src/app/shared/router-interaction-types';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { User } from '../user.model';
import { UserService } from '../user.service';
declare var $: any;
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
  selectedUser: any;
  searchKey: '';
  filterObj: any;
  searchName = '';
  searchEmail = '';
  searchPhone = '';
  searchUserType='';
  visibleFilter = false;
  currentUser:AppUser;
  isAdmin:boolean = false
  addUserType = '';
  constructor(private userService: UserService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document) {
    //this.selectedUser = new User();
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      if (this.currentUser.Role == "Admin") {
        this.isAdmin = true;
      }
    }
  }

  ngOnInit(): void {
    this.GetUserTotalCount();
    this.loadAutoComplete();
    this.checkState();
  }
  checkState(): void {
    if(history?.state?.data as RouterAction !== 'add-new-client')
      return;
    this.addUserType = 'Client';
    $('#addclient').modal('toggle');
  }

  GetUserTotalCount() {
    this.isLoading = true;
    this.selectedUser = new User();
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

  setSelectedUser(user: any) {
    this.selectedUser = {...user};
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
    if (this.searchName == '' && this.searchEmail == '' && this.searchPhone == '' && this.searchUserType=='')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  actionFilter() {
    this.filterObj = [
      this.searchName,  
      this.searchEmail,
      this.searchPhone,
      this.searchUserType
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

  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }

  private loadAutoComplete() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAkgh7ckSQasqRYvX7BXOwEGEzunexf_EY&libraries=places&v=weekly';
    this.loadScript(url);
  }

  onInviteModalOpen(): void {
    this.addUserType = ''; // Modal is not being opened programmatically, so clear it
  }
}
