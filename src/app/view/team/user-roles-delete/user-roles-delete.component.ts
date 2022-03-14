import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamService } from '../team.service';
import { Role } from '../team.model';
import { ToastrService } from 'ngx-toastr';
import { user_roles_delete } from 'src/app/shared/toast-message-text';

declare var $: any

@Component({
  selector: 'app-user-roles-delete',
  templateUrl: './user-roles-delete.component.html',
  styleUrls: ['./user-roles-delete.component.scss']
})
export class UserRoleDeleteComponent implements OnInit {

  @Input() selectedRole: Role;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private teamService: TeamService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.teamService.Delete(this.selectedRole.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(user_roles_delete.delete_user_roles_success);
        $('#deleteRole').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_roles_delete.delete_user_roles_error);
      this.hasError = false;
    })
  }

}
