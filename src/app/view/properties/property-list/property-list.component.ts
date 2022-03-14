import { Component, OnInit, TemplateRef } from '@angular/core';
import { PropertiesService } from '../properties.service';
import { Properties } from '../properties.model';
import { common_error_message, property_import, success_icon } from 'src/app/shared/toast-message-text';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentTemplateService } from 'src/app/services/document-template-service';
import { AppSessionStorageService } from '../../../shared/session-storage.service';
import { AppUser } from '../../auth-register/auth-register.model';
import { ToastrService } from 'ngx-toastr';
import { PropertyDocumentService } from '../propertyDocument.service';
import { OrganizationService } from 'src/app/view/organizations/organization.service';
import { Organization } from 'src/app/shared/shared.model';
import { Router } from '@angular/router';
import { AddToExistingCampaignFM } from '../add-to-existing-campaign-form.model';
import { CampaignService } from 'src/app/services/campaign.service';
import { map } from 'rxjs/internal/operators/map';
import { UpdateOfferPriceFormModel } from '../update-offer-price.form.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DeletePropertyFormModel } from '../delete-property-form.model';
declare var $: any;

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss',
    '../../../../assets/css/app.css',]
})

export class PropertyListComponent implements OnInit {
  public Editor = ClassicEditor;
  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  visibleFilter = false;
  properties: Properties[];
  finalproperties: Properties[];
  imgUrl: any;
  templateType = '';
  imageHeight = 200;
  imageWidth = 400;
  editorForm: FormGroup;
  public content;
  selectedTemplateType = '';
  title = '';
  searchKey = '';
  searchZipCode = '';
  searchOwner = '';
  searchCity = '';
  searchCounty = '';
  searchStatus = '';
  filterObj: any;
  currentUser: AppUser;
  selectedPropertyId: any;
  addToCampaignFormModel: AddToExistingCampaignFM;
  isAllChecked: boolean = false;
  setOfferPrice: {ids: string[],value:string} = {
    ids: [],
    value: ''
  };
  selectedPropertyCountText: string = '';
  updateOfferPrice: {ids: string[], adjustment:string,value:string} = {
    ids: [],
    adjustment: '0',
    value: ''
  }
  newOfferPrice: string = '';
  deleteAction: DeletePropertyFormModel = new DeletePropertyFormModel()
  constructor(private propertiesService: PropertiesService,
    private _documentTemplateService: DocumentTemplateService,
    private propertyDocumentService: PropertyDocumentService,
    private appSessionStorageService: AppSessionStorageService,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private router: Router,
    private campaignService: CampaignService,
    private _modalService: BsModalService) { }

  async ngOnInit(): Promise<void> {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
    this.GetUserOrganizationTotalCount();
    this.editorForm = new FormGroup({
      editor: new FormControl(),
      type: new FormControl(),
    });
    this.addToCampaignFormModel = new AddToExistingCampaignFM('', '', []);
    this.addToCampaignFormModel.campaignList = await this.campaignService.getAllCampaign(this.currentUser.OrgId).pipe(map((res:any[]) => {
      return res.map((x) => {
        return {
          id : x["id"],
          name : x["campaignName"],
          properties: x["properties"]
        }
      })
    })).toPromise();
    this.addToCampaignFormModel.campaignId = this.addToCampaignFormModel.campaignList[0]?.id;
  }

  GetAll() {
    this.isLoading = true;
    this.propertiesService.GetAllProperties(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data: any[]) => {
      data = data.map((prop) => {
        prop.checked = false
        return prop;
      })
      this.properties = this.finalproperties = data;
      
      for (let i = 0; i < this.properties.length; i ++) {
        for (let j = 0; j < this.addToCampaignFormModel.campaignList.length; j ++) {
          for (let k = 0; k < this.addToCampaignFormModel.campaignList[j].properties.length; k ++) {
            if (this.properties[i].id == this.addToCampaignFormModel.campaignList[j].properties[k].id) {
              this.properties[i].campaignStatus = "Active";
              this.properties[i].campaignName = "Campaign name:" + this.addToCampaignFormModel.campaignList[j].name;
            }
          }
        }
      }
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.toastr.error(common_error_message);
    })
  }

  GetUserOrganizationTotalCount() {
    this.isLoading = true;
    this.propertiesService.GetTotalCount().subscribe((data: any) => {
      this.isLoading = false;
      this.total = data;
      this.GetAll();
    }, (error) => {
      this.toastr.error(common_error_message);
      this.isLoading = false;
    })
  }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.GetAll();
    }
  }

  onSubmit() {
    if (this.templateType == '')
      this.toastr.error("Document template is required");
    else {
      let formData = this.editorForm.value;
      let data = {
        "name": this.title,
        "documentType": this.templateType,
        "templateData": formData.editor,
        "propertyId": this.selectedPropertyId,
        "createdBy": this.currentUser.DisplayName,
        "status": "Draft",
        "addedDate": new Date(),
        "organizationId": this.currentUser.OrgId
      }
      this.propertyDocumentService.createPropertyDocument({List: [data]}).subscribe((res) => {
        console.log(res);
        $("#docTemplateModel").modal('hide');
        this.toastr.success("Document generated successfully");
      }, (error) => {
        this.toastr.error(common_error_message);
      })
    }
  }

  getTemplate(event: any, propertyId) {
    if(!propertyId)
      propertyId = this.selectedPropertyId;
    if (event != '') {
      this.templateType = event;
      this.propertiesService.GetProperties(propertyId).subscribe((propertyRes) => {
        this._documentTemplateService
          .getTemplate(event)
          .subscribe(async(res) => {
            this.content = res;
            console.log(this.content)
            await this.setTemplateData(this.content.template, propertyRes);
          });
      });
    }
  }

  replaceAll(source: string, pattern: string | RegExp, val: string): string{
    let checkIncludes:Function = (): boolean => {
      if(typeof pattern === 'string')
        return source.includes(pattern as string)
      return (pattern as RegExp).test(source)
    }
    while(checkIncludes())
      source = source.replace(pattern, val);
    return source;
  }
  
  async setTemplateData(templateData: string,propertyData): Promise<void> {
    
    let organization:Organization = await this.organizationService.GetCurrentOrganization().toPromise();
    templateData = this.replaceAll(templateData, /&#171;Your CompanyName&#187;/g, this.currentUser.OrgName || '') //TO-DO: Consider upgrading to ES2021
    templateData = this.replaceAll(templateData, /&#171;Your Company Address&#187;/g, organization.address || '')
    templateData = this.replaceAll(templateData, /&#171;Your Company Email&#187;/g,organization.email || '')
    templateData = this.replaceAll(templateData, /&#171;Your Company Phone&#187;/g,organization.phone || '')
    templateData = this.replaceAll(templateData, /&#171;Your company Fax&#187;/g,organization.fax || '')
    templateData = this.replaceAll(templateData, /&#171;OwnerName_Formatted&#187;/g,propertyData.ownerName || '')
    templateData = this.replaceAll(templateData, /&#171;MailAddress&#187;/g,propertyData.mailAddress || '')
    templateData = this.replaceAll(templateData, /&#171;MUnitType&#187;/g,propertyData.mUnitType || '')
    templateData = this.replaceAll(templateData, /&#171;MUnitNumber&#187;/g,propertyData.mUnitNumber || '')
    templateData = this.replaceAll(templateData, /&#171;MCity&#187;/g,propertyData.mCity || '')
    templateData = this.replaceAll(templateData, /&#171;MState&#187;/g,propertyData.mState || '')
    templateData = this.replaceAll(templateData, /&#171;MZip&#187;/g,propertyData.mZip || '')
    templateData = this.replaceAll(templateData, /&#171;Your Name&#187;/g,this.currentUser.given_name || '')
    templateData = this.replaceAll(templateData, /&#171;Your company name&#187;/g,this.currentUser.OrgName || '')
    templateData = this.replaceAll(templateData, /&#171;MZip&#187;/g,propertyData.mZip || '')
    templateData = this.replaceAll(templateData, /&#171;Property APN&#187;/g,propertyData.apn || '')
    templateData = this.replaceAll(templateData, /&#171;Property Acreage&#187;/g,propertyData.landSquareFootage ? propertyData.landSquareFootage/43560 + '' : '')
    templateData = this.replaceAll(templateData, /&#171;Property Legal Description&#187;/g,propertyData.landUseDescription || '')
    templateData = this.replaceAll(templateData, /&#171;Property Market Value&#187;/g,propertyData.marketValue || '')
    templateData = this.replaceAll(templateData, /&#171;Property Offer Price&#187;/g,propertyData.totalAssessedValue || '')
    templateData = this.replaceAll(templateData, /&#171;Property Address&#187;/g,propertyData.propertyAddress || '')
    templateData = this.replaceAll(templateData, /&#171;CountyName&#187;/g,propertyData.countyName || '')
    templateData = this.replaceAll(templateData, /&#171;PState&#187;/g,propertyData.pState || '')
    templateData = this.replaceAll(templateData, /&#171;OwnerNames&#187;/g,
      `${propertyData.ownerName1Full || ''}</br>
      ${propertyData.ownerName2Full || ''}</br>
      ${propertyData.ownerName3Full || ''}</br>
      ${propertyData.ownerName4Full || ''}</br>`
    || '')
    templateData = this.replaceAll(templateData, /&#171;Amount&#187;/g,propertyData.totalAssessedValue || '')
    //templateData = this.replaceAll(templateData, /&#171;Your Company Website&#187;/g,((TO-DO)) || '')
    templateData = this.replaceAll(templateData, /&#171;Your title&#187;/g,this.currentUser.occupation + '<p>&nbsp' + new Date().toDateString() + '<p>'); // Add date after signature
    (this.editorForm.controls.editor as FormControl).setValue(
      templateData
    );
  }

  showDocTemplate(type, propertyId) {
    if (type == 'offer') {
      this.templateType = '1';
      this.title = 'Generate Offer';
      this.getTemplate(this.templateType, propertyId);
    } else {
      this.templateType = '';
      this.title = 'Generate Other Document';
      (this.editorForm.controls.editor as FormControl).setValue('');
    }
    this.selectedPropertyId = propertyId;
    this.selectedTemplateType = type;
    $("#docTemplateModel").modal('show');
  }

  addToExistingCampaign(propertyId: string): void{
    if(!this.addToCampaignFormModel.campaignList?.length){
      this.toastr.error("No existing campaigns found");
      return;
    }
    this.addToCampaignFormModel.propertyId = propertyId;
    $('#addToExistingCampaignModal').modal('show');
  }

  onAddToExistingCampaignSubmit(): void{
    $("#addToExistingCampaignModal").modal('hide');
    this.router.navigate(['/campaigns', 
      this.addToCampaignFormModel.propertyId,
      this.addToCampaignFormModel.campaignId
    ])
  }

  detailAction(id) {
    localStorage.setItem("propertyID", id);
    this.router.navigate(['/properties/property-details/' + id + '/overview']);
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.properties = this.finalproperties.filter(x => (x.apn != null && x.apn.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) || (x.propertyAddress != null && x.propertyAddress.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) || (x.owner1LName != null && x.owner1LName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.properties = this.finalproperties;
  }

  onChange(val) {
    if (this.searchCity == '' && this.searchCounty == '' && this.searchOwner == '' && this.searchStatus == '' && this.searchZipCode == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchZipCode = '';
    this.searchOwner = '';
    this.searchCity = '';
    this.searchCounty = '';
    this.searchStatus = '';
    this.filterObj = ['', '', '', '', ''];
    this.visibleFilter = false;
    this.GetAll();
  }

  actionFilter() {
    this.filterObj = [
      this.searchZipCode,  
      this.searchOwner,
      this.searchCity,
      this.searchCounty,
      this.searchStatus,
    ]
    this.GetAll();
  }

  search(event) {
    if(event.keyCode == 13) {
      this.GetAll();
    }
  }

  checkAll():void{
    this.isAllChecked = !this.isAllChecked;
    this.properties.forEach(element => {
      element.checked = this.isAllChecked
    });
  }
  checkboxClick(property: Properties):void{
    property.checked = !property?.checked
    var count: number = this.properties.filter(x => x.checked).length;
    if(!count)
      this.selectedPropertyCountText = '';
    else
      this.selectedPropertyCountText = `${count} properties selected`;
  }
  beginUpdateOfferPrice(id: string = ''){
    $('#updateOfferPriceModal').modal('show');
    if(id)
      this.updateOfferPrice.ids = [id];
    else // bulk action
      this.updateOfferPrice.ids = this.properties.filter(x => x.checked).map(x => x.id);
  }
  async updateOfferPriceSubmit():Promise<void>{
    var updateList:UpdateOfferPriceFormModel[] = [];
    for(var id of this.updateOfferPrice.ids){
      var property = this.properties.filter(x => x.id === id)[0];
      var numericValue: number = parseFloat(this.updateOfferPrice.value)
      if(isNaN(numericValue)){
        this.toastr.error('Invalid input');
        return;
      }
      var adjustedVal: number = 0;
      switch(this.updateOfferPrice.adjustment){
        case '0':
          adjustedVal = numericValue;
          break;
        case '1':
          var adjustedVal = this.adjustPercentage(property, numericValue);
          break;
        case '2':
          var adjustedVal:number = this.adjustPercentage(property, -numericValue)
          break;
        case '3':
          var areaNbr:number = parseFloat(property.lotArea);
          var acreage: number;
          switch(property.lotAreaUnits){
            case 'AC':
              acreage = areaNbr;
              break;
            case 'SF':
              acreage = areaNbr / 43560 ;
              break;
            default:
              acreage = -1;
          }
          if(acreage < 0 || isNaN(acreage)){
            this.toastr.error('Property acreage is not available for selected property/properties, cannot use this adjustment option')
            return;
          }
          var adjustedVal = Math.floor(numericValue * acreage);
      }
      if(isNaN(adjustedVal)){
        this.toastr.error('Assessed value is not available for selected property/properties, cannot use this adjustment option')
        return;
      }
      updateList.push({
        OfferPrice: adjustedVal + '',
        PropertyId: id
      })
    } 
    $('#updateOfferPriceModal').modal('hide');
    await this.offerPriceSubmit(updateList)
  }
  adjustPercentage(prop: Properties, numericValue: number):number {
    var numericOfferPrice:number = parseFloat(prop.offerPrice);
    if(isNaN(numericOfferPrice))
      numericOfferPrice = parseFloat(prop.totalAssessedValue);
    return Math.floor((1 + numericValue/100) * numericOfferPrice);
  }
  async offerPriceSubmit(updateList: UpdateOfferPriceFormModel[]): Promise<void>{
    await this.propertiesService.setOfferPrice(updateList).toPromise();
    updateList.forEach((item) => {
      var property = this.properties.filter(x => x.id === item.PropertyId)[0];
      property.offerPrice = item.OfferPrice
    })
    this.toastr.success('Saved successfully');
  }
  async deleteProperties():Promise<void>{
    try{
      await this.propertiesService.deleteProperies(this.deleteAction.list.map(x => x.id)).toPromise();
      this.properties = this.properties.filter(x => !x.checked);
      this.toastr.success('Deleted successfully')
      this.deleteAction.modalRef.hide();
    }
    catch(err){
      this.toastr.error('Unexpected error')
    }
  }
  async openModal(template: TemplateRef<any>, deleteList: Properties[] = []): Promise<void>
  {
    if(deleteList.length)
      this.deleteAction.list = deleteList;
    else
      this.deleteAction.list = this.properties.filter(x => x.checked);
    if(!this.deleteAction.list.length)
      this.toastr.error('No properties selected');
    else{
      this.deleteAction.message = await this.getDeleteMessage();
      this.deleteAction.modalRef = this._modalService.show(template, { animated: false, class: 'modal-sm' });
    }
      
  }
  async getDeleteMessage():Promise<string>{
    var result = await this.propertiesService.getLinkedCampaignCount(this.deleteAction.list.map(x => x.id)).toPromise();
    if(!result){
      if(this.deleteAction.list.length === 1)
        return 'Are you sure you want to delete this property?'
      return 'Are you sure you want to delete the ' + this.deleteAction.list.length + ' selected properties?'
    }
    else{
      if(this.deleteAction.list.length === 1)
        return 'This property belongs to a campaign and will be removed from it. Are you sure you want to delete this property?'
      return 'One or more properties belong to an active campaign and will be removed. Do you want to proceed?'
    }
  }
}
