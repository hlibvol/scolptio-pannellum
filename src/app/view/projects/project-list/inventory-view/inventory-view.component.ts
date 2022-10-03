import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { ProjectService } from '../../project.service';
import { ProjectListInteractionService } from '../project-list-interaction.service';
import { InventoryFilters, NumericFilterComparator, Payload } from './inventory-view.model';

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
  inventoryFiltersForm: InventoryFilters<NgOption> = new InventoryFilters<NgOption>();
  modalRef: BsModalRef<any> = new BsModalRef();
  readonly yesNoOptions: NgOption[] = [
    {
      label: 'Unspecified',
      value: undefined
    },
    {
      label: 'Yes',
      value: true
    },
    {
      label: 'No',
      value: false
    },
  ]
  readonly garageTypeOptions: NgOption[] = [
    {
      label: 'Unspecified',
      value: undefined
    },
    {
      label: 'Attached',
      value: 1
    },
    {
      label: 'Detached',
      value: 2
    }
  ]
  readonly numericFilterOptions: {
    text: string,
    value: NumericFilterComparator
  }[] = [
    {
      text: 'Or Less',
      value: NumericFilterComparator.OrLess
    },
    {
      text: 'Or More',
      value: NumericFilterComparator.OrMore
    },
  ]
  constructor(private _projectService: ProjectService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private _projectListInteractionService: ProjectListInteractionService,
    private _bsModalService: BsModalService) { 
      if (this.appSessionStorageService.getCurrentUser() != null) {
        this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      }
      this.listUpdatedSubscription = this._projectListInteractionService.listUpdated.subscribe(() => {
        this.GetAllproject()
      })
      this.inventoryFiltersForm.isInventoryMode = true;
    }
  ngOnDestroy(): void {
    this.listUpdatedSubscription.unsubscribe();
  }
  async GetAllproject(): Promise<void> {
    this.isLoading = true;
    try {
      const filters = this._prepareFilters();
      const response: any = await this._projectService.GetAllProject(-1, -1, '', [], this.currentUser.TeamId, [], filters).toPromise();
      this.inventoryItems = response.data;
    }
    catch(err) {
      console.error(err)
      this.toastr.error(common_error_message);
    }
    finally {
      this.isLoading = false;
    }
  }
  private _prepareFilters(): InventoryFilters<Payload> {
    let filters: InventoryFilters<Payload> = new InventoryFilters();
    filters.isInventoryMode = this.inventoryFiltersForm?.isInventoryMode;
    filters.squareFootage = this.inventoryFiltersForm?.squareFootage;
    filters.heatedSquareFootage = this.inventoryFiltersForm?.heatedSquareFootage;
    filters.beds = this.inventoryFiltersForm?.beds;
    filters.baths = this.inventoryFiltersForm?.baths;
    filters.floors = this.inventoryFiltersForm?.floors;
    filters.garage = this.inventoryFiltersForm?.garage;
    filters.garageTypes = this.inventoryFiltersForm?.garageTypes?.map(x => (x.value ? parseFloat((x as NgOption).value.toString()) : null));
    filters.frontPatios = this.inventoryFiltersForm?.frontPatios?.map(x => (x as NgOption).value as boolean);
    filters.decks = this.inventoryFiltersForm.decks?.map(x => (x as NgOption).value as boolean);
    return filters;
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

  openSearch(template: TemplateRef<any>): void {
    this.modalRef = this._bsModalService.show(template, {
      class: 'modal-md'
    })
  }
  async doSearch(): Promise<void>{
    this.modalRef.hide();
    await this.GetAllproject();
  }
}
