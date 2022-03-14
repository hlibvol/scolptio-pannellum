import { Component, OnInit, TemplateRef, Inject, Renderer2 } from '@angular/core';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { ListingService } from '../listing.service';
import { Listing } from '../listing.model';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-listings-list',
  templateUrl: './listings-list.component.html',
  styleUrls: ['./listings-list.component.scss',
    '../../../../assets/css/app.css']
})
export class ListingsListComponent implements OnInit {

  lists: Listing[];
  finallists: Listing[];
  selectedList: Listing;
  currentUser: AppUser;
  isLoading = false;
  modalRef: BsModalRef;
  listingId : any;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  filterObj: any;
  visibleFilter = false;
  searchAccessType = '';
  searchKey = '';
  constructor(private listingService: ListingService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    ) {
    this.selectedList = new Listing();
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.selectedList = new Listing();
    this.GetListingsTotalCount();
  }

  GetListingsTotalCount() {
    this.isLoading = true;
    this.listingService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.getList();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  getList() {
    this.isLoading = true;
    this.listingService.GetAll(this.currentUser.OrgId, this.filterObj, this.pageSize, this.pageNumber).subscribe((data: any[]) => {
      this.lists = this.finallists = data;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.toastr.error(common_error_message);
    })
  }

  onChangeEvent() {
    this.getList();
  }

  onSelectItem(item: Listing) {
    this.selectedList = item;
  }

  openModal(template : TemplateRef<any>,listingId : any){
    this.listingId = listingId;
    this.modalRef = this.modalService.show(template,{animated:false,class: 'modal-xl'});
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getList();
    }
  }

  clearFilter() {
    this.searchAccessType = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.getList();
  }

  actionFilter() {
    this.filterObj = [
      this.searchAccessType,  
    ]
    this.getList();
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.lists = this.finallists.filter(x => (x.address != null && x.address.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.lists = this.finallists;
  }

  onChange(val) {
    if (this.searchAccessType == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

}
