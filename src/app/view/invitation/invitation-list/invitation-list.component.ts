import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Invitation } from '../invitation.model';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.scss',
    '../../../../assets/css/app.css',]
})
export class InvitationListComponent implements OnInit {

  isLoading = false;
  userList: Invitation[];
  finaluserList: Invitation[];
  errorMsg = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  selectedInvitation: Invitation;
  searchKey: '';
  filterObj: any;
  searchName = '';
  searchEmail = '';
  searchPhone = '';
  visibleFilter = false;
  constructor(private invitationService: InvitationService,
    private toastr: ToastrService) {
    this.selectedInvitation = new Invitation();
  }

  ngOnInit(): void {
    this.GetUserTotalCount();
  }

  GetUserTotalCount() {
    this.isLoading = true;
    this.invitationService.GetUserTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAll();
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isLoading = false;
    })
  }

  GetAll() {
    this.isLoading = true;
    this.invitationService.GetUsersInformationByOrg(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.isLoading = false;
      this.userList = this.finaluserList = data;
      console.log(data.length);
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.toastr.error('Something went wrong. Please try again later.');
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

  setSelectedUser(user: Invitation) {
    this.selectedInvitation = user;
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

  clearFilter() {
    this.searchName = '';
    this.searchEmail = '';
    this.searchPhone = '';
    this.filterObj = ['', '', ''];
    this.visibleFilter = false;
    this.GetAll();
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.userList = this.finaluserList.filter(x => (x.name != null && x.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.userList = this.finaluserList;
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAll();
    }
  }

}
