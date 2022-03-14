import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TeamService } from '../team.service';
import add_permissions from '../../../shared/data/add_permission.json';
import { Role } from '../team.model';
import { ToastrService } from 'ngx-toastr';
import { user_roles_edit } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-user-roles-edit',
  templateUrl: './user-roles-edit.component.html',
  styleUrls: ['./user-roles-edit.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class UserRolesEditComponent implements OnInit, OnChanges {

  @Input() selectedRole: Role;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  addPermissions = add_permissions;
  roleName: string;
  isSaving = false;
  errorMsg = '';
  constructor(private teamService: TeamService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.reset();
  }

  ngOnChanges() {
    if (this.selectedRole) {
      this.roleName = this.selectedRole.title;
      this.preparePermissionView(this.selectedRole);
    }
  }

  preparePermissionView(selectedRole: Role) {
    if (selectedRole && selectedRole.permissions) {
      for (let permission of selectedRole.permissions) {
        if (permission.isActive) {
          const permissionCategory = this.addPermissions[permission.category];
          const permissionGroup = permissionCategory.find((x: { group: string; }) => x.group === permission.group);
          const key = permission.key.split('_')[0];
          permissionGroup[key].isActive = true;
        } else {
          const permissionCategory = this.addPermissions[permission.category];
          const permissionGroup = permissionCategory.find((x: { group: string; }) => x.group === permission.group);
          const key = permission.key.split('_')[0];
          permissionGroup[key].isActive = false;
        }
      }
    }
  }

  close(form: any) {
    this.reset();
    form.resetForm();
    $('#editRole').modal('toggle');
  }

  saveRole(form: any) {
    this.isSaving = true;
    const selectedPermisions = this.getSelectedPermissions();
    this.teamService.UpdateRole(this.selectedRole.id, this.roleName, selectedPermisions).subscribe((data: any) => {
      setTimeout(() => {
        this.isSaving = false;
        this.updateSuccessEvent.emit("value");
        this.toastr.info(user_roles_edit.edit_user_roles_success);
        this.close(form);
      }, 1000);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_roles_edit.edit_user_roles_error);
      this.isSaving = false;
    })
  }

  getSelectedPermissions(): string[] {
    const selectedPermisions = [];
    const categoryList = ['Selling Cycle', 'Buying Cycle', 'Administration'];
    for (const category of categoryList) {
      for (let permission of this.addPermissions[category]) {
        if (permission.view.isActive) {
          selectedPermisions.push(permission.view.id);
        }
        if (permission.edit.isActive) {
          selectedPermisions.push(permission.edit.id);
        }
        if (permission.add.isActive) {
          selectedPermisions.push(permission.add.id);
        }
        if (permission.delete.isActive) {
          selectedPermisions.push(permission.delete.id);
        }
      }
    }
    return selectedPermisions;
  }

  reset() {
    this.roleName = '';
    const categoryList = ['Selling Cycle', 'Buying Cycle', 'Administration'];
    for (const category of categoryList) {
      for (let permission of this.addPermissions[category]) {
        permission.view.isActive = false;
        permission.edit.isActive = false;
        permission.add.isActive = false;
        permission.delete.isActive = false;
      }
    }
  }

}
