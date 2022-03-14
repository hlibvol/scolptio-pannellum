import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Mailhouse } from '../mailhouse.model';
import { MailhouseService } from '../mailhouse.service';
declare var $: any;

@Component({
  selector: 'app-mailhouse-add',
  templateUrl: './mailhouse-add.component.html',
  styleUrls: ['./mailhouse-add.component.scss',
              '../../../../assets/css/app.css']
})
export class MailhouseAddComponent implements OnInit {
 
  @Output() addSuccessEvent = new EventEmitter<string>();

  
  mailhouse: Mailhouse;
  errorMsg = ''
  isSaving = false;
  currentUser: AppUser;

  constructor(private mailhouseService: MailhouseService,
    private appSessionStorageService: AppSessionStorageService) {
    this.mailhouse = new Mailhouse();
    this.mailhouse.status = 'Active';
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  save() {
    this.errorMsg = '';
    this.isSaving = true;
    this.mailhouseService.Save(this.mailhouse).subscribe((data: any) => {
      this.isSaving = false;
      this.reset();
      this.addSuccessEvent.emit("value");
      $('#createMailHouse').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.isSaving = false;
    })
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    
  }

  reset() {
    this.mailhouse = new Mailhouse();
  }

}