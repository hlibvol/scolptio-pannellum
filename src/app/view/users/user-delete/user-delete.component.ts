import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { user_delete } from 'src/app/shared/toast-message-text';
import { User } from '../user.model';
import { UserService } from '../user.service';
declare var $: any

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {

  @Input() selectedUser: User;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private userService: UserService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.userService.RemoveUserFromOrganization(this.selectedUser.id, this.selectedUser.organizationId).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(user_delete.delete_user_success);
        $('#deleteUser').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_delete.delete_user_error);
      this.hasError = false;
    })
  }

}
