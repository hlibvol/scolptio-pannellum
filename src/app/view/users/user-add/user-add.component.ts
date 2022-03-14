import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../user.service';
import { Team } from '../../team/team.model';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, user_add } from 'src/app/shared/toast-message-text';

declare var $: any;
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss',
    '../../../../assets/css/app.css']
})
export class UserAddComponent implements OnInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  isSaving = false;
  email: string;
  fullName: string;
  teamId: string;
  phone: string;
  address: string;
  errorMsg = '';
  isLoading = false;
  teamList: Team[];

  constructor(private userService: UserService,
    private toastr: ToastrService) {
    this.teamId = null;
  }

  ngOnInit(): void {
    this.GetAllTeam();
  }

  InviteUser(form: any) {
    this.errorMsg = '';
    this.isSaving = true;
    this.userService.InviteUser(this.email, this.fullName, this.teamId, this.phone, this.address).subscribe((data: any) => {
      this.isSaving = false;
      this.toastr.info(user_add.add_user_success);
      form.resetForm();
      this.addSuccessEvent.emit("value");
      $('#inviteUser').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(user_add.add_user_error);
      this.isSaving = false;
    })
  }

  GetAllTeam() {
    this.isLoading = true;
    this.userService.GetAllTeam(1, 100).subscribe((data: any[]) => {
      this.isLoading = false;
      this.teamList = data;
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

}
