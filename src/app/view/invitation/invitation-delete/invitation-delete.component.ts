import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Invitation } from '../invitation.model';
import { InvitationService } from '../invitation.service';
declare var $: any

@Component({
  selector: 'app-invitation-delete',
  templateUrl: './invitation-delete.component.html',
  styleUrls: ['./invitation-delete.component.scss']
})
export class InvitationDeleteComponent implements OnInit {

  @Input() selectedInvitation: Invitation;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private invitationService: InvitationService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this.invitationService.DeleteInvitation(this.selectedInvitation.invitedUserEmail).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info('✔ User Invitation sent successfully.');
        $('#deleteInvitation').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error('Something went wrong, could not sent user invitation.');
      this.hasError = false;
    })
  }

}
