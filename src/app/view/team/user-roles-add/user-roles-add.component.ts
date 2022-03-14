import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { user_roles_add } from 'src/app/shared/toast-message-text';
import add_permissions from '../../../shared/data/add_permission.json';
import { TeamService } from '../team.service';

declare var $: any;
@Component({
  selector: 'app-user-roles-add',
  templateUrl: './user-roles-add.component.html',
  styleUrls: ['./user-roles-add.component.scss',
    '../../../../assets/css/app.css',
    '../../../../assets/css/icons.css']
})
export class UserRolesAddComponent implements OnInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  addPermissions = add_permissions;
  roleName: string;
  isSaving = false;
  errorMsg = '';
  constructor(private teamService: TeamService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.reset();
  }

  close(form: any) {
    this.reset();
    form.resetForm();
    $('#addRole').modal('toggle');
  }

  saveRole(form: any) {
    this.isSaving = true;
    const selectedPermisions = this.getSelectedPermissions();
    this.teamService.SaveRole(this.roleName, selectedPermisions).subscribe((data: any) => {
      setTimeout(() => {
        this.isSaving = false;
        this.addSuccessEvent.emit("value");
        this.toastr.info(user_roles_add.add_user_roles_success);
        this.close(form);
      }, 1000);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_roles_add.add_user_roles_error);
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
