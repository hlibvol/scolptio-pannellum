import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { ProjectService } from '../../project.service';
import { ProjectListInteractionService } from '../project-list-interaction.service';

@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.scss',
  '../../../../../assets/css/app.css',
  '../../../../../assets/css/icons.css',
  '../../../../../assets/auth-pages/sass/bootstrap/bootstrap.scss']
})
export class InventoryViewComponent implements OnInit, OnDestroy {
  isLoading = false;
  inventoryItems: any[] = [];
  currentUser: AppUser;
  listUpdatedSubscription: Subscription;
  showFilters: boolean = true
  yesNo: NgOption[] = [
    {
      label: 'Yes',
      value: "Yes"
    },
    {
      label: 'No',
      value: "No"
    },
]
  constructor(private _projectService: ProjectService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private _projectListInteractionService: ProjectListInteractionService) { 
      if (this.appSessionStorageService.getCurrentUser() != null) {
        this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      }
      this.listUpdatedSubscription = this._projectListInteractionService.listUpdated.subscribe(() => {
        this.GetAllproject()
      })
    }
  ngOnDestroy(): void {
    this.listUpdatedSubscription.unsubscribe();
  }
  async GetAllproject(): Promise<void> {
    this.isLoading = true;
    try {
      let response: any = await this._projectService.GetAllProject(-1, -1, '', [], this.currentUser.TeamId, [], true).toPromise();
      this.inventoryItems = response.data;
    }
    catch {
      this.toastr.error(common_error_message);
    }
    finally {
      this.isLoading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.GetAllproject()
  }

  selectedUpdated(item: any): void {
    this._projectListInteractionService.broadcastSelectedUpdated(item);
  }

  detailsClicked(item: any): void {
    this._projectListInteractionService.broadcastOpenDetails(item);
  }
}
