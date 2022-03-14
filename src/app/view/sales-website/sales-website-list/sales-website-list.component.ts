import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AwsService } from 'src/app/services/aws.service';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { SalesWebsiteService } from '../sales-website.service';


@Component({
  selector: 'app-sales-website-list',
  templateUrl: './sales-website-list.component.html',
  styleUrls: ['./sales-website-list.component.scss',
              '../../../../assets/css/app.css',]
})
export class SalesWebsiteListComponent implements OnInit {

  public Editor = ClassicEditor;
  public salesList : any = [];
  public finalsalesList : any = [];
  currentUser: AppUser;
  isLoading : boolean = false;
  modalRef: any;
  deleteId : any;
  selectedWebsiteName:any;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  searchKey: '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;

  constructor(private _awsService: AwsService, private _toaster: ToastrService,private modalService: BsModalService,private _router : Router,private _salesService : SalesWebsiteService,private appSessionStorageService: AppSessionStorageService) { 
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.getSales();
  }

  getSales(){
    this.isLoading = true;
    this._salesService.GetTotalCount().subscribe(res=>{
      this.total = res;
      this._salesService.GetAll(this.pageNumber,this.pageSize, this.searchKey, this.filterObj).subscribe(res=>{
        this.isLoading = false;
        res.forEach(element => {
          this._awsService.GetUrl(element.websiteLogo).then(result => {
            element.websiteLogo = result;
          })
        });
        this.salesList = this.finalsalesList = res;
      })
    })
  }

  add(){
    this._router.navigate(["/sales-website/add"]);
  }

  openModal(template: TemplateRef<any>,id : any,websiteName : any) 
  {
    this.selectedWebsiteName = websiteName;
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, { animated: false, class: 'modal-xl' });
  }

  deleteRecord(id:any){
    let model = {
      SaleswebsiteId : id
    }
    this._salesService.Delete(model).subscribe(res=>{
      this._toaster.success("Data Deleted Successfully");
      this.modalRef.hide();
      this.getSales();
    })
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getSales();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.salesList = this.finalsalesList.filter(x => (x.websiteName != null && x.websiteName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.salesList = this.finalsalesList;
  }

  onChange(val) {
    if (this.searchStatus == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchStatus = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.getSales();
  }

  actionFilter() {
    this.filterObj = [
      this.searchStatus,  
    ]
    this.getSales();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.getSales();
    }
  }
}
