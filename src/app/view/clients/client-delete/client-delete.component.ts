import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { client_delete } from 'src/app/shared/toast-message-text';
import { IncomeService } from '../../income/income.service';
import { ClientsService } from '../clients.service';
declare var $: any;
@Component({
  selector: 'app-client-delete',
  templateUrl: './client-delete.component.html',
  styleUrls: ['./client-delete.component.scss']
})
export class ClientDeleteComponent implements OnInit {

  @Input() client:any;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;
  hasError = false;

  constructor(private _clientService : ClientsService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
  }

  delete() {
    this.hasError = false;
    this._clientService.DeleteClients(this.client.id).subscribe((data: any) => {
      if (data === false) {
        this.hasError = true;
      } else {
        this.hasError = false;
        this.deleteSuccessEvent.emit("value");
        this.toastr.info(client_delete.delete_client_success);
        $('#deleteClient').modal('toggle');
      }
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(client_delete.delete_client_error);
      this.hasError = false;
    })
  }

}

