import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mailhouse } from '../mailhouse.model';
import { MailhouseService } from '../mailhouse.service';
declare var $: any

@Component({
  selector: 'app-mailhouse-delete',
  templateUrl: './mailhouse-delete.component.html',
  styleUrls: ['./mailhouse-delete.component.scss']
})
export class MailhouseDeleteComponent implements OnInit {

  @Input() selectedList: Mailhouse;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;

  constructor(private mailhouseService: MailhouseService) {
  }

  ngOnInit(): void {
  }

  delete() {
    const requestBody = {
      mailhouseId: this.selectedList.id
    }
    this.mailhouseService.Delete(requestBody).subscribe((data: any[]) => {
      this.deleteSuccessEvent.emit("value");
      $('#deleteMailHouse').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
    })
  }

}
