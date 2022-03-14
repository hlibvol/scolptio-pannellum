import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { organization_delete } from 'src/app/shared/toast-message-text';
import { Organization } from '../organization.model';
import { OrganizationService } from '../organization.service';
declare var $: any

@Component({
  selector: 'app-organization-delete',
  templateUrl: './organization-delete.component.html',
  styleUrls: ['./organization-delete.component.scss']
})
export class OrganizationDeleteComponent implements OnInit {

  @Input() selectedOrganization: Organization;

  @Output() deleteSuccessEvent = new EventEmitter<string>();

  errorMsg: string;

  constructor(private organizationService: OrganizationService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  delete() {
    const requestBody = {
      orgId: this.selectedOrganization.id
    }
    this.organizationService.Delete(requestBody).subscribe((data: any[]) => {
      this.deleteSuccessEvent.emit("value");
      this.toastr.info(organization_delete.delete_organization_success);
      $('#deleteOrganization').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(organization_delete.delete_organization_error);
    })
  }

}
