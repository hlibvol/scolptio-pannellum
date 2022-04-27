import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { user_edit } from 'src/app/shared/toast-message-text';
import { Role } from '../../team/team.model';
import { TeamService } from '../../team/team.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

declare var $: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss',
    '../../../../assets/css/app.css']
})
export class UserEditComponent implements OnInit, OnChanges {

  @Input() selectedUser: User;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  isLoading = false;
  userRoles: Role[];
  errorMsg = '';
  isSaving = false;
  constructor(private teamService: TeamService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.GetRoles();
  }

  ngOnChanges() {
    this.prepareMemberData();
  }

  GetRoles() {
    this.isLoading = true;
    this.teamService.GetRole(1, 100, null, null).subscribe((data: any) => {
      this.userRoles = data;
      const index = this.userRoles.findIndex(x => x.title.toLocaleLowerCase() === 'superadmin');
      if (index > -1) {
        this.userRoles.splice(index, 1);
      }
      const defaultUser = this.userRoles.find(x => x.title.toLocaleLowerCase() === 'defaultuser');
      if (defaultUser) {
        defaultUser.title = defaultUser.title.replace('User', ' User');
      }
      this.prepareMemberData();
      this.isLoading = false;
    }, (error) => {
      this.errorMsg = 'Something went wrong. Please try again later.';
      this.isLoading = false;
    })
  }

  prepareMemberData() {
    if (this.selectedUser && this.selectedUser.roles != null && this.selectedUser.roles.length > 0) {
      const role = document.getElementById('user-role-edit');
      if (role) {
        const options = role['options'];
        if (options && options.length > 0) {
          for (let i = 0; i < options.length; i++) {
            const isExist = this.selectedUser.roles.find((x: any) => x === options[i].value);
            if (isExist) {
              $('#user-role-edit')[0]['options'][i].selected = true;
            } else {
              $('#user-role-edit')[0]['options'][i].selected = false;
            }
          }
        }
      }
    }
    if ($('.select2').length) {
      $('.select2').select2();
    }
  }

  save(form: any) {
    this.errorMsg = '';
    const roleIds = [];
    const members = document.getElementById('user-role-edit');
    if (members != null) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            roleIds.push(option.value);
          }
        }
      }
    }
    this.isSaving = true;
    this.userService.AssignUserRole(this.selectedUser.id, roleIds).subscribe((data: any) => {
      this.isSaving = false;
      this.updateSuccessEvent.emit("value");
      this.toastr.info(user_edit.edit_user_success);
      this.close(form);
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_edit.edit_user_error);
      this.isSaving = false;
    })
  }

  close(form: any) {
    form.resetForm();
    this.reset();
    $('#editUser').modal('toggle');
  }

  reset() {
    this.selectedUser = new User();

    const members = document.getElementById('user-role-edit');
    if (members) {
      const options = members['options'];
      if (options && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          $('#user-role-edit')[0]['options'][i].selected = false;
        }
      }
    }
    if ($('.select2').length) {
      $('.select2').select2();
    }
  }

}
