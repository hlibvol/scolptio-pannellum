import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { Mailhouse } from '../mailhouse.model';
import { MailhouseService } from '../mailhouse.service';
declare var $: any

@Component({
  selector: 'app-mailhouse-edit',
  templateUrl: './mailhouse-edit.component.html',
  styleUrls: ['./mailhouse-edit.component.scss',
              '../../../../assets/css/app.css']
})
export class MailhouseEditComponent implements OnInit {

  
  @Input() selectedList: Mailhouse;

  @Output() updateSuccessEvent = new EventEmitter<string>();
  
  errorMsg = ''
  isSaving = false;
  currentUser: AppUser;

  constructor(private mailhouseService: MailhouseService,
    private appSessionStorageService: AppSessionStorageService) {
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  update() {
    this.errorMsg = '';
    this.isSaving = true;
    this.mailhouseService.Update(this.selectedList).subscribe((data: any) => {
      this.isSaving = false;
      this.selectedList = new Mailhouse();
      this.updateSuccessEvent.emit("value");
      $('#editMailHouse').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.isSaving = false;
    })
  }


  reset() {
    this.selectedList = new Mailhouse();
  }

}
