import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { Organization } from '../organization.model';
import { OrganizationService } from '../organization.service';

declare var $: any;
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss',
    '../../../../assets/css/app.css',]
})
export class OrganizationListComponent {

  organizations: Organization[];
  finalorganizations: any = [];
  currentUser: AppUser;
  selectedOrganization: Organization;
  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  errorMsg = '';
  filterObj: any;
  searchStatus = '';
  searchTimezone = '';
  visibleFilter = false;
  searchKey: '';
  constructor(private organizationService: OrganizationService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
    this.selectedOrganization = new Organization();
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
    this.GetUserOrganizationTotalCount();
  }

  GetUserOrganizationTotalCount() {
    this.isLoading = true;
    this.organizationService.GetUserOrganizationTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetUserOrganization();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetUserOrganization() {
    this.isLoading = true;
    this.organizationService.GetUserOrganization(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      this.organizations = this.finalorganizations = data;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.toastr.error(common_error_message);
    })
  }

  setSelectedOrganization(org: Organization) {
    this.selectedOrganization = org;
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetUserOrganization();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.organizations = this.finalorganizations.filter(x => x.adminName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 || x.phone.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.organizations = this.finalorganizations;
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,  
      this.searchTimezone,
    ]
    this.GetUserOrganization();
  }

  onChange(val) {
    if (this.searchStatus == '' && this.searchTimezone == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchStatus = '';
    this.searchTimezone = '';
    this.filterObj = ['', ''];
    this.visibleFilter = false;
    this.GetUserOrganization();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetUserOrganization();
    }
  }
}
