import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from 'src/app/services/campaign.service';
import { DocumentTemplateService } from 'src/app/services/document-template-service';
import { map } from 'rxjs/operators';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { FormBuilder } from '@angular/forms';
import { AppUser } from '../../auth-register/auth-register.model';
declare var $: any;
import { ActivatedRoute } from '@angular/router';
import { PropertyOwnerPipe } from 'src/app/shared/pipes/property-owner.pipe';
import { PropertyGridParams } from '../property-grid-params';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: [
    './campaign-list.component.scss',
    '../../../../assets/css/app.css',
  ],
})
export class CampaignListComponent implements OnInit {
  dataForFilter: any = [];
  selected: any = [];
  properties: any = [];
  countyArray: any = [];
  statusData: any = [];
  documentTemplateData: any = [];
  pricingData: any = [];
  campaignData: any = [];
  finalCampaignData: any = [];
  editCampaignData: any;
  gridParams: PropertyGridParams = new PropertyGridParams;
  filterProperty = this.formBuilder.group({
    zip: [''],
    ownerName: [''],
    pCity: [''],
    countyName: [''],
    propertyStatus: ['']
  });

  campaignName = ""; selectedDocTemplate: any; templateId = "";
  selectedMailType = ""; selectedShippingClass = ""; printType = ""; doubleSided = "";
  progress = 0;
  estimatedMaillingCost = 0; sendingFrequency = ""; sendCount = 0; createdBy = ""; startDate = null; endDate = null;
  jobTime = "12 PM";
  jobTiming = ["9 AM", "12 PM", "3 PM", "6 PM"];
  campaignStatus = "Draft";
  filterd: any;
  pageNumber = 1;
  pageSize = 1000;
  pageSize1 = 10;
  total = 0;
  currentUser: AppUser;
  tabIndex = 0;
  searchKey = '';
  searchStatus = '';
  visibleFilter = false;
  filterObj: any;
  actionType = 'add';
  propertyId: any;
  campaignId: string;
  action:string;

  sortClasses = {
    address: '',
    owner: '',
    price: ''
  }
  properties$ = this.campaignService.getProperties(this.pageNumber, this.pageSize).pipe(
    map((propertyList) => {
      this.dataForFilter = this.properties = propertyList;
      this.countyArray = this.dataForFilter.reduce(function (a, b) {
        if (a.indexOf(b.countyName) < 0) a.push(b.countyName);
        return a;
      }, []);
      return propertyList;
    })
  );
  

  constructor(
    private campaignService: CampaignService,
    private documentTemplateService: DocumentTemplateService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private appSessionStorageService: AppSessionStorageService,
    private ownerPipe: PropertyOwnerPipe
  ) {
    this.action = this.route.snapshot.paramMap.get('action');
    this.propertyId = this.route.snapshot.paramMap.get('propertyId');
    this.campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.gridParams.limit = 50;
    this.gridParams.sortKey = 'address';
    this.gridParams.sortReverse = true;
  }

  ngOnInit(): void {
   
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }

    if(this.action){
      $("#createCampaign").modal('show');
    }

    this.properties$.subscribe((res) => {
      this.properties = res;
      if (this.propertyId && !this.action) {
        if(this.campaignId){
          this.updateCampaign(this.campaignData.filter(x => x.id === this.campaignId)[0])
          $('#editCampaign').modal('show')
        }
        else
          $("#createCampaign").modal('show');
        this.getSelected(this.properties.filter(a => a.id === this.propertyId)[0]);
      }
      else if(!this.action) $("#createCampaign").modal('hide');
    });
    this.campaignService.getPropertiesTotalCount().subscribe((data: any) => {
    });
    this.campaignService.getPropertyStatusList().subscribe((data) => {
      this.statusData = data;
    });
    this.documentTemplateService.getData(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data) => {
      this.documentTemplateData = data;
      if (this.documentTemplateData.length == 0)
        this.toastrService.error("Document template data not found. Please create at least one document template.");
    });
    this.campaignService.getMailPricingList().subscribe((data) => {
      this.pricingData = data;
    });
    this.getAllCampaignData();
  }

  getAllCampaignData() {
    this.campaignService.getAllCampaign(this.currentUser.OrgId).subscribe((data) => {
      this.campaignData = this.finalCampaignData = data;
      
      this.total = this.campaignData.length;
    });
  }

  getSelected(property: any) {
    if (this.selected.length === 0) {
      this.selected.push(property);
      this.calculateCost();
      return;
    }
    if (this.selected.length > 0 && !this.selected.some((x) => x.apn === property.apn)) {
      this.selected.push(property);
    } else {
      if (this.selected.some((x) => x.apn === property.apn)) {
        this.selected = this.selected.filter((x) => x.apn !== property.apn);
      }
    }
    this.calculateCost();
  }

  changeTemplate(documentTemplateId) {
    if (documentTemplateId != '') {
      this.selectedDocTemplate = this.documentTemplateData.filter(a => a.id === documentTemplateId)[0];
      //$("#documentTemplate").modal('show');
    } else $("#documentTemplate").modal('hide');
  }

  changeMailType(mailType) {
    this.selectedMailType = mailType;
    this.calculateCost();
  }

  changeShippingClass(shippingClass) {
    this.selectedShippingClass = shippingClass;
    this.calculateCost();
  }

  calculateCost() {
    if (this.actionType == 'add') {
      if (this.selectedMailType && this.selectedShippingClass) {
        let fdata = this.pricingData.filter(a => a.plan === this.selectedMailType
          && a.shippingType === this.selectedShippingClass);
        this.estimatedMaillingCost = fdata.length > 0 ? fdata[0].amount * this.selected.length : (
          this.selectedMailType ? (this.pricingData.filter(a => a.plan === this.selectedMailType)[0].amount * this.selected.length) : 0
        );
      } else if (this.selectedMailType)
        this.estimatedMaillingCost = this.pricingData.filter(a => a.plan === this.selectedMailType)[0].amount * this.selected.length;
      else
        this.estimatedMaillingCost = 0;
    } else {
      if (this.editCampaignData.mailType && this.editCampaignData.shippingClass) {
        let fdata = this.pricingData.filter(a => a.plan === this.editCampaignData.mailType
          && a.shippingType === this.editCampaignData.shippingClass);
        this.estimatedMaillingCost = fdata.length > 0 ? fdata[0].amount * this.selected.length : (
          this.editCampaignData.mailType ? (this.pricingData.filter(a => a.plan === this.editCampaignData.mailType)[0].amount * this.selected.length) : 0
        );
      } else if (this.editCampaignData.mailType)
        this.estimatedMaillingCost = this.pricingData.filter(a => a.plan === this.editCampaignData.mailType)[0].amount * this.selected.length;
      else
        this.estimatedMaillingCost = 0;
    }
  }

  selectAllProperties(all?: string) {
    if (all && this.selected.length === this.properties.length) {
      return;
    }
    this.selected = [];

    this.properties.map((p, i) => {
      var element = document.getElementById(`property${i}`)
      if(element)
        element['checked'] = document.getElementById(`checkAll`)['checked'];

      if (document.getElementById(`checkAll`)['checked']) {
        this.selected.push(p);
      }
    });

    if (all) {
      document.getElementById(`checkAll`)['checked'] = true;
    }
    this.calculateCost();
  }

  deSelectAllProperties() {
    this.selected = [];
    document.getElementById(`checkAll`)['checked'] = false;
    this.properties.map((p, i) => {
      document.getElementById(`property${i}`)['checked'] = false;
    });
    this.calculateCost();
  }

  applyFilter(data) {
    this.filterd = [...this.dataForFilter];
    if (data.zip)
      this.filterd = this.filterd.filter((x) => x.pZip === data.zip);
    if (data.ownerName)
      this.filterd = this.filterd.filter((x) => this.ownerPipe.transform(x) === data.ownerName);
    if (data.pCity)
      this.filterd = this.filterd.filter(x => x.pCity === data.pCity);
    if (data.propertyStatus)
      this.filterd = this.filterd.filter(x => x.propertyStatus === data.propertyStatus);
    if (data.countyName)
      this.filterd = this.filterd.filter(x => x.countyName === data.countyName);
    this.properties = this.filterd;
  }

  clearFilter() {
    this.properties = this.dataForFilter;
    this.filterProperty.reset();
    this.filterProperty.setValue({ zip: '', ownerName: '', pCity: '', countyName: '', propertyStatus: '' });
    this.getAllCampaignData();
  }

  addCampaign() {
    if (this.documentTemplateData.length == 0)
      this.toastrService.error("Document template data not found. Please create at least one document template.");
    else
      $("#createCampaign").modal('show');
  }

  submitForm() {
    if (this.campaignName == '')
      this.toastrService.error("Campaign name is required");
    else if (!this.selectedDocTemplate)
      this.toastrService.error("Document template is required");
    else if (this.selected.length == 0)
      this.toastrService.error("Please select at least one property");
    else if (this.selectedMailType == '')
      this.toastrService.error("Mail type is required");
    else if (this.selectedShippingClass == '')
      this.toastrService.error("Shipping class is required");
    else if (this.printType == '')
      this.toastrService.error("Print type is required");
    else if (this.doubleSided == '')
      this.toastrService.error("Double sided is required");
    else if (this.sendingFrequency == '')
      this.toastrService.error("Sending frequency is required");
    else if (this.sendCount == 0)
      this.toastrService.error("Send count must be greater than zero");
    else if (this.startDate == null || this.startDate == '')
      this.toastrService.error("Start date is required");
    else if (this.endDate == null || this.endDate == '')
      this.toastrService.error("End date is required");
    else if (this.sendCount > this.selected.length)
      this.toastrService.error("Send count can not be greater than selected properties");
    else if (this.endDate < this.startDate)
      this.toastrService.error("End date is greater than start date");
    else if (this.isPastDate(this.startDate))
      this.toastrService.error("Start date is greater than now");
    else {
      this.calculateProgress('add');
      let data = {
        campaignName: this.campaignName,
        documentTemplateId: this.selectedDocTemplate.id,
        properties: this.selected,
        mailType: this.selectedMailType,
        shippingClass: this.selectedShippingClass,
        printType: this.printType,
        doubleSided: this.doubleSided,
        estimatedMaillingCost: this.estimatedMaillingCost,
        sendingFrequency: this.sendingFrequency,
        sendCount: this.sendCount,
        progress: this.progress,
        createdBy: this.currentUser.DisplayName,
        status: "Draft",
        addedDate: new Date(),
        startDate: this.startDate,
        endDate: this.endDate,
        jobTime: this.jobTime,
        organizationId: this.currentUser.OrgId
      }
      this.campaignService.createCampaign(data).subscribe((data: any) => {
        this.reset();
        this.toastrService.success("Campaign added successfully");
      }, (error) => {
        this.toastrService.error(error);
      })
    }
  }

  calculateProgress(type) {
    var date1 = type == 'edit' ? new Date(this.editCampaignData.startDate) : new Date(this.startDate);
    var date2 = type == 'edit' ? new Date(this.editCampaignData.endDate) : new Date(this.endDate);
    var diffDays = Math.ceil((date2.valueOf() - date1.valueOf()) / (1000 * 60 * 60 * 24));
    let count = type == 'edit' ? this.editCampaignData.sendCount : this.sendCount;
    let frequency = type == 'edit' ? this.editCampaignData.sendingFrequency : this.sendingFrequency;
    if (frequency == 'Daily')
      this.progress = count * diffDays;
    else if (frequency == 'Weekly')
      this.progress = count * Math.ceil(diffDays / 7);
    else if (frequency == 'Monthly')
      this.progress = count * Math.ceil(diffDays / 30);
  }

  reset() {
    this.campaignName = '';
    this.selectedDocTemplate = undefined;
    this.selected = [];
    this.selectedMailType = '';
    this.selectedShippingClass = '';
    this.printType = '';
    this.doubleSided = '';
    this.estimatedMaillingCost = 0;
    this.sendingFrequency = '';
    this.sendCount = 0;
    this.startDate = null;
    this.endDate = null;
    this.progress = 0;
    $("#createCampaign").modal('hide');
    this.selected = [];
    this.tabIndex = 0;
    this.getAllCampaignData();
  }

  deleteCampaign(campaignId) {
    if (confirm('Are you sure you want to delete this campaign?')) {
      this.campaignService.deleteCampaign(campaignId).subscribe((data: any) => {
        this.getAllCampaignData();
        this.toastrService.success("Campaign deleted successfully");
      }, (error) => {
        this.toastrService.error(error);
      })
    }
  }

  updateCampaign(campaignData) {
    if (this.documentTemplateData.length == 0)
      this.toastrService.error("Document template data not found. Please create at least one document template.");
    else {
      this.selected = [];
      this.actionType = 'edit';
      this.selected = campaignData.properties;
      this.editCampaignData = campaignData;
      this.properties.forEach(e => {
        let selected = campaignData.properties.filter(a => a.id == e.id);
        if (selected.length > 0) {
          e.selected = true;
          this.calculateCost();
        } else
          e.selected = false;
      });
    }
  }

  saveCampaign() {
    this.editCampaignData.properties = this.selected;
    this.editCampaignData.progress = this.progress;
    this.campaignService.updateCampaign(this.editCampaignData).subscribe((data: any) => {
      $("#editCampaign").modal('hide');
      this.editCampaignData = undefined;
      this.selected = []; this.actionType = 'add';
      this.tabIndex = 0;
      this.getAllCampaignData();
      this.toastrService.success("Campaign updated successfully");
    }, (error) => {
      this.toastrService.error(error);
    })
  }

  onSearchChange(searchValue: string): void {
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

  onSearchList(searchValue) {
    if (searchValue != '')
      this.campaignData = this.finalCampaignData.filter(x => x.campaignName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    else
      this.campaignData = this.finalCampaignData;
  }

  statusChange(stausCmp) {
    if (stausCmp != '')
      this.campaignData = this.finalCampaignData.filter(x => x.status === stausCmp);
    else
      this.campaignData = this.finalCampaignData;
  }

  next(action) {
    if (this.tabIndex <= 3) {
      if (this.checkValidation(action))
        this.tabIndex++;
    }
  }

  back() {
    if (this.tabIndex >= 1)
      this.tabIndex--;
  }

  checkValidation(action) {
    if (action == 'add') {
      if (this.tabIndex == 0) {
        if (this.campaignName == '') {
          this.toastrService.error("Campaign name is required"); return false;
        } else if (!this.selectedDocTemplate) {
          this.toastrService.error("Document template is required"); return false;
        } else if (this.selected.length == 0) {
          this.toastrService.error("Please select at least one property"); return false;
        } else return true;
      } else if (this.tabIndex == 1) {
        if (this.selectedMailType == '') {
          this.toastrService.error("Mail type is required"); return false;
        } else if (this.selectedShippingClass == '') {
          this.toastrService.error("Shipping class is required"); return false;
        } else if (this.printType == '') {
          this.toastrService.error("Print type is required"); return false;
        } else if (this.doubleSided == '') {
          this.toastrService.error("Double sided is required"); return false;
        } else return true;
      } else if (this.tabIndex == 2) {
        if (this.sendingFrequency == '') {
          this.toastrService.error("Sending frequency is required"); return false;
        } else if (this.sendCount == 0) {
          this.toastrService.error("Send count must be greater than zero"); return false;
        } else if (this.sendCount > this.selected.length) {
          this.toastrService.error("Send count can not be greater than selected properties"); return false;
        } else if (this.startDate == null || this.startDate == '') {
          this.toastrService.error("Start date is required"); return false;
        } else if (this.endDate == null || this.endDate == '') {
          this.toastrService.error("End date is required"); return false;
        } else if (this.endDate < this.startDate) {
          this.toastrService.error("End date is greater than start date"); return false;
        } else if (this.isPastDate(this.startDate)) {
          this.toastrService.error("Start date is greater than now"); return false;
        } else { this.calculateProgress('add'); return true; }
      } else {
        return true;
      }
    } else {
      if (this.tabIndex == 0) {
        if (this.editCampaignData.campaignName == '') {
          this.toastrService.error("Campaign name is required"); return false;
        } else if (this.editCampaignData.documentTemplateId == '') {
          this.toastrService.error("Document template is required"); return false;
        } else if (this.editCampaignData.status == '') {
          this.toastrService.error("Status is required"); return false;
        } else if (this.selected.length == 0) {
          this.toastrService.error("Please select at least one property"); return false;
        } else return true;
      } else if (this.tabIndex == 1) {
        if (this.editCampaignData.mailType == '') {
          this.toastrService.error("Mail type is required"); return false;
        } else if (this.editCampaignData.shippingClass == '') {
          this.toastrService.error("Shipping class is required"); return false;
        } else if (this.editCampaignData.printType == '') {
          this.toastrService.error("Print type is required"); return false;
        } else if (this.editCampaignData.doubleSided == '') {
          this.toastrService.error("Double sided is required"); return false;
        } else return true;
      } else if (this.tabIndex == 2) {
        if (this.editCampaignData.sendingFrequency == '') {
          this.toastrService.error("Sending frequency is required"); return false;
        } else if (this.editCampaignData.sendCount == 0 || !this.editCampaignData.sendCount) {
          this.toastrService.error("Send count must be greater than zero"); return false;
        } else if (this.editCampaignData.sendCount > this.selected.length) {
          this.toastrService.error("Send count can not be greater than selected properties"); return false;
        } else if (this.editCampaignData.startDate == null || this.editCampaignData.startDate == '') {
          this.toastrService.error("Start date is required"); return false;
        } else if (this.editCampaignData.endDate == null || this.editCampaignData.endDate == '') {
          this.toastrService.error("End date is required"); return false;
        } else if (this.editCampaignData.endDate < this.editCampaignData.startDate) {
          this.toastrService.error("End date is greater than start date"); return false;
        } else if (this.isPastDate(this.editCampaignData.startDate)) {
          this.toastrService.error("Start date is greater than now"); return false;
        } else { this.calculateProgress('edit'); return true; }
      } else {
        return true;
      }
    }
  }
  isPastDate(date: Date):boolean{
    var today = new Date();
    var yesterday = new Date();
    yesterday.setUTCDate(today.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    var copy = new Date(date);
    copy.setUTCHours(0, 0, 0, 0);
    return copy <= yesterday;
  }
  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getAllCampaignData();
    }
  }

  onChange(val) {
    if (this.searchStatus == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilters() {
    this.searchStatus = '';
    this.visibleFilter = false;
    this.getAllCampaignData();
  }

  actionFilter() {
    if (this.searchStatus != '')
      this.campaignData = this.finalCampaignData.filter(x => x.status == this.searchStatus);
    else
      this.campaignData = this.finalCampaignData;
  }

  changeSF(event) {
    if (event == 'One time') {
      if (this.editCampaignData)
        this.editCampaignData.sendCount = this.selected.length;
      else
        this.sendCount = this.selected.length;
    } else {
      if (this.editCampaignData)
        this.editCampaignData.sendCount = 0;
      else
        this.sendCount = 0;
    }
  }
  sortProperties(key: string){
    if(this.gridParams.sortKey === key)
      this.gridParams.sortReverse = !this.gridParams.sortReverse;
    else
      this.gridParams.sortKey = key;

    this.sortClasses = {
      address: '',
      owner: '',
      price: ''
    };
    this.sortClasses[key] = this.gridParams.sortReverse ? ['os-icon', 'os-icon-arrow-down6'] : ['os-icon','os-icon-arrow-up6'];
  }
}
