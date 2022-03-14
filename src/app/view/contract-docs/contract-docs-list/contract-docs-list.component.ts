import { Component, OnInit } from '@angular/core';
import { AppUser } from '../../auth-register/auth-register.model';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
declare var $: any;
import { PropertyDocumentService } from '../../properties/propertyDocument.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contract-docs-list',
  templateUrl: './contract-docs-list.component.html',
  styleUrls: ['./contract-docs-list.component.scss',
    '../../../../assets/css/app.css',],
  providers: [PropertyDocumentService, CampaignService]
})
export class ContractDocsListComponent implements OnInit {
  selected = [];
  currentUser: AppUser;
  documentData = [];
  finalDocumentData = [];
  pageNumber = 1;
  pageSize = 1000;
  total = 0;
  properties: any = [];
  dataForFilter: any = [];
  editDocumentData: any;
  searchKey: '';
  visibleFilter = false;
  searchZipCode = '';
  searchCity = '';
  searchOwner = '';
  properties$ = this.campaignService.getProperties(this.pageNumber, this.pageSize).pipe(
    map((propertyList) => {
      this.dataForFilter = this.properties = propertyList;
      return propertyList;
    })
  );

  constructor(private propertyDocumentService: PropertyDocumentService,
    private campaignService: CampaignService,
    private appSessionStorageService: AppSessionStorageService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
    this.properties$.subscribe((res) => {
      this.properties = res;
      this.getAllDocumentData();
    });
  }

  getAllDocumentData() {
    this.propertyDocumentService.getAllPropertyDocument(this.currentUser.OrgId).subscribe((data: any) => {
      this.documentData = this.finalDocumentData = data;
      this.documentData.forEach(e => {
        e.propertyData = this.dataForFilter.filter(a => a.id === e.propertyId)[0];
        console.log(this.documentData)
      });
    }, (error) => {
      this.toastrService.error(error);
    })
  }

  getDocumentType(type) {
    if (type == "1")
      return "Offer Letter";
    else if (type == "2")
      return "Neighbor Letter";
    else if (type == "3")
      return "Blind Offer envelope";
    else if (type == "4")
      return "BLIND OFFER (2nd offer)";
    else if (type == "5")
      return "Neutral Letter";
    else return "";
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getAllDocumentData();
    }
  }

  deleteDocument(documnetId) {
    if (confirm('Are you sure you want to delete this campaign?')) {
      this.propertyDocumentService.deletePropertyDocument(documnetId).subscribe((data: any) => {
        this.getAllDocumentData();
        this.toastrService.success("Document deleted successfully");
      }, (error) => {
        this.toastrService.error(error);
      })
    }
  }

  onSearchChange(searchValue: string): void {
    if (searchValue != '')
      this.documentData = this.finalDocumentData.filter(x => x.name.indexOf(searchValue) !== -1);
    else
      this.documentData = this.finalDocumentData;
  }

  documentChange(type) {
    if (type != '')
      this.documentData = this.finalDocumentData.filter(x => x.documentType === type);
    else
      this.documentData = this.finalDocumentData;
  }

  onPropertySearchChange(searchValue: string): void {
    if (searchValue != '')
      this.properties = this.dataForFilter.filter(x => x.propertyAddress.indexOf(searchValue) !== -1);
    else
      this.properties = this.dataForFilter;
  }

  sorting(type) {
    if (type == 'asc') {
      this.properties.sort((a, b) => a.propertyAddress.localeCompare(b.propertyAddress));
    } else {
      this.properties.sort((a, b) => b.propertyAddress.localeCompare(a.propertyAddress));
    }
  }

  getSelected(property: any) {
    if (this.selected.length === 0) {
      this.selected.push(property);
      return;
    }
    if (this.selected.length > 0 && !this.selected.some((x) => x.apn === property.apn)) {
      this.selected.push(property);
    } else {
      if (this.selected.some((x) => x.apn === property.apn)) {
        this.selected = this.selected.filter((x) => x.apn !== property.apn);
      }
    }
    console.log(this.selected)
  }

  updateDocument(documentData) {
    this.selected = [];
    this.editDocumentData = documentData;
    this.properties.forEach(e => {
      let selected = this.dataForFilter.filter(a => e.id === documentData.propertyId);
      if (selected.length > 0) {
        this.selected.push(e);
        e.selected = true;
      } else
        e.selected = false;
    });
    $("#editDocument").modal('show');
  }

  saveDocument() {
    if (this.editDocumentData.name == '')
      this.toastrService.error("Document name is required");
    else if (this.editDocumentData.documentType == '')
      this.toastrService.error("Document type is required");
    else if (this.selected.length > 1 || this.selected.length == 0)
      this.toastrService.error("Select only one property");
    else {
      this.editDocumentData.propertyId = this.selected[0].id;
      this.editDocumentData.createdBy = this.currentUser.DisplayName;
      this.propertyDocumentService.updatePropertyDocument(this.editDocumentData).subscribe((data: any) => {
        $("#editDocument").modal('hide');
        this.editDocumentData = undefined;
        this.selected = []; 
        this.getAllDocumentData();
        this.toastrService.success("Document updated successfully");
      }, (error) => {
        this.toastrService.error(error);
      })
    }
  }

  onChange(val) {
    if (this.searchZipCode == '' && this.searchCity == '' && this.searchOwner == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.visibleFilter = false;
  }

  search(event) {
    if(event.keyCode == 13) {
    }
  }
}


