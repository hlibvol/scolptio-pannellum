import { Component, OnInit } from '@angular/core';
import { Role } from '../team.model';
import { TeamService } from '../team.service';
import permissions from '../../../shared/data/view_permission.json';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrls: ['./user-roles-list.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class UserRolesListComponent implements OnInit {

  isLoading = false;
  errorMsg = '';
  userRoles: Role[];
  finaluserRoles: Role[];
  isVisibleDetails = false;
  userPermissions = permissions;
  selectedRole: Role;
  toBeDeleteRole: Role;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  searchKey: '';
  searchName = '';
  visibleFilter = false;
  filterObj: any;

  constructor(private teamService: TeamService,
    private toastr: ToastrService) {
    this.toBeDeleteRole = new Role();
  }

  ngOnInit(): void {
    this.GetRoleTotalCount();
  }

  GetRoleTotalCount() {
    this.isLoading = true;
    this.teamService.GetRoleTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetRoles();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  GetRoles() {
    this.isLoading = true;
    this.teamService.GetRole(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any) => {
      this.isLoading = false;
      this.userRoles = this.finaluserRoles = data;

      const superAdmin = this.userRoles.find(x => x.title.toLocaleLowerCase() === 'superadmin');
      if (superAdmin) {
        superAdmin.title = superAdmin.title.replace('Admin', ' Admin');
        this.selectedRole = superAdmin;
      } else {
        this.selectedRole = data[0];
      }

      const defaultUser = this.userRoles.find(x => x.title.toLocaleLowerCase() === 'defaultuser');
      if (defaultUser) {
        defaultUser.title = defaultUser.title.replace('User', ' User');
      }
      if (this.selectedRole) {
        this.preparePermissionView(this.selectedRole);
        this.isVisibleDetails = true;
      } else {
        this.isVisibleDetails = false;
      }
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  setSelectedRole(role: Role): void {
    this.selectedRole = role;
    this.preparePermissionView(role);
  }


  setToBeDeleteRole(role: Role): void {
    this.toBeDeleteRole = role;
  }

  preparePermissionView(selectedRole: Role) {
    if (selectedRole) {
      this.resetRole();
      for (let permission of selectedRole.permissions) {
        if (permission.isActive) {
          const permissionCategory = this.userPermissions[permission.category];
          const permissionGroup = permissionCategory.find((x: { group: string; }) => x.group === permission.group);
          const key = permission.key.split('_')[0];
          permissionGroup[key].isActive = true;
        } else {
          const permissionCategory = this.userPermissions[permission.category];
          const permissionGroup = permissionCategory.find((x: { group: string; }) => x.group === permission.group);
          const key = permission.key.split('_')[0];
          permissionGroup[key].isActive = false;
        }
      }
    }
  }

  resetRole() {
    const categoryList = ['Selling Cycle', 'Buying Cycle', 'Administration'];
    for (const category of categoryList) {
      for (let permission of this.userPermissions[category]) {
        permission.view.isActive = false;
        permission.edit.isActive = false;
        permission.add.isActive = false;
        permission.delete.isActive = false;
      }
    }
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetRoles();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.userRoles = this.finaluserRoles.filter(x => (x.title != null && x.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.userRoles = this.finaluserRoles;
  }

  onChange(val) {
    if (this.searchName == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchName = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.GetRoles();
  }

  actionFilter() {
    this.filterObj = [
      this.searchName,  
    ]
    this.GetRoles();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetRoles();
    }
  }

}
