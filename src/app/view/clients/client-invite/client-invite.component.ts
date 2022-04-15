import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { client_delete } from 'src/app/shared/toast-message-text';
import { ClientsService } from '../clients.service';
declare var $: any;
@Component({
  selector: 'app-client-invite',
  templateUrl: './client-invite.component.html',
  styleUrls: ['./client-invite.component.scss']
})
export class ClientInviteComponent implements OnInit {

  @Input() client:any;

  @Output() inviteEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private _clientService : ClientsService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  selectedOption(event:any){
    this.inviteEvent.emit(event);
  }

}
