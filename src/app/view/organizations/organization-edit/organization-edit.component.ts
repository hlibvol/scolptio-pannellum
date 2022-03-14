import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { organization_edit } from 'src/app/shared/toast-message-text';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { Organization } from '../organization.model';
import { OrganizationService } from '../organization.service';
declare var $: any;

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.scss',
    '../../../../assets/css/app.css']
})
export class OrganizationEditComponent implements OnInit, OnChanges {
  @Input() selectedOrganization: Organization;
  @Output() updateSuccessEvent = new EventEmitter<string>();
  errorMsg = ''
  isSaving = false;
  currentUser: AppUser;
  imageData: string;

  constructor(private organizationService: OrganizationService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnChanges() {
    this.imageData = this.selectedOrganization.image;
  }

  update() {
    if (this.checkValidation()) {
      this.isSaving = true;
      this.selectedOrganization.image = this.imageData;
      this.organizationService.Update(this.selectedOrganization).subscribe((data: any) => {
        this.isSaving = false;
        this.selectedOrganization = new Organization();
        this.updateSuccessEvent.emit("value");
        this.toastr.success(organization_edit.edit_organization_success);
        $('#editOrg').modal('toggle');
      }, (error) => {
        this.toastr.error(organization_edit.edit_organization_error);
        this.isSaving = false;
      })
    }
  }

  checkValidation() {
    if (this.selectedOrganization.title == '' || !this.selectedOrganization.title) {
      this.toastr.error("Title is required"); return false;
    } else if (this.selectedOrganization.description == '' || !this.selectedOrganization.description) {
      this.toastr.error("Description is required"); return false;
    } else if (this.selectedOrganization.address == '' || !this.selectedOrganization.address) {
      this.toastr.error("Address is required"); return false;
    } else if (this.selectedOrganization.email == '' || !this.selectedOrganization.email) {
      this.toastr.error("Email is required"); return false;
    } else if (this.selectedOrganization.phone == '' || !this.selectedOrganization.phone) {
      this.toastr.error("Phone is required"); return false;
    } else if (this.selectedOrganization.fax == '' || !this.selectedOrganization.fax) {
      this.toastr.error("Fax is required"); return false;
    } else if (this.selectedOrganization.timeZone == '' || !this.selectedOrganization.timeZone) {
      this.toastr.error("Timezone is required"); return false;
    } else if (this.selectedOrganization.status == '' || !this.selectedOrganization.status) {
      this.toastr.error("Status is required"); return false;
    } else {
      return true;
    }
  }

  reset() {
    this.selectedOrganization = new Organization();
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
