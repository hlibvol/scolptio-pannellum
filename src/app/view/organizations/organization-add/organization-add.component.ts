import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { Organization } from '../organization.model';
import { OrganizationService } from '../organization.service';
import { ToastrService } from 'ngx-toastr';
import { organization_add } from 'src/app/shared/toast-message-text';

declare var $: any;

@Component({
  selector: 'app-organization-add',
  templateUrl: './organization-add.component.html',
  styleUrls: ['./organization-add.component.scss',
    '../../../../assets/css/app.css']
})
export class OrganizationAddComponent implements OnInit {
  @Output() addSuccessEvent = new EventEmitter<string>();
  organization: Organization;
  errorMsg = ''
  isSaving = false;
  currentUser: AppUser;
  imageData: string;

  constructor(private organizationService: OrganizationService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
    this.organization = new Organization();
    this.organization.status = 'Active';
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  save() {
    if (this.checkValidation()) {
      this.isSaving = true;
      this.organization.image = this.imageData;
      this.organizationService.Save(this.organization).subscribe((data: any) => {
        this.isSaving = false;
        this.reset();
        this.toastr.success(organization_add.add_organization_success);
        this.addSuccessEvent.emit("value");
        $('#createOrg').modal('toggle');
      }, (error) => {
        this.toastr.error(organization_add.add_organization_error);
        this.isSaving = false;
      })
    }
  }

  checkValidation() {
    if (this.organization.title == '' || !this.organization.title) {
      this.toastr.error("Title is required"); return false;
    } else if (this.organization.description == '' || !this.organization.description) {
      this.toastr.error("Description is required"); return false;
    } else if (this.organization.address == '' || !this.organization.address) {
      this.toastr.error("Address is required"); return false;
    } else if (this.organization.email == '' || !this.organization.email) {
      this.toastr.error("Email is required"); return false;
    } else if (this.organization.phone == '' || !this.organization.phone) {
      this.toastr.error("Phone is required"); return false;
    } else if (this.organization.fax == '' || !this.organization.fax) {
      this.toastr.error("Fax is required"); return false;
    } else if (this.organization.timeZone == '' || !this.organization.timeZone) {
      this.toastr.error("Timezone is required"); return false;
    } else if (this.organization.status == '' || !this.organization.status) {
      this.toastr.error("Status is required"); return false;
    } else {
      return true;
    }
  }

  reset() {
    this.organization = new Organization();
  }

  onChangeImg($event: Event) {
    this.isSaving = true;
    const file = ($event.target as HTMLInputElement).files[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((data) => {
      this.imageData = data;
      this.isSaving = false;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    }

    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    }
  }

  removeImage() {
    this.imageData = null;
  }

}
