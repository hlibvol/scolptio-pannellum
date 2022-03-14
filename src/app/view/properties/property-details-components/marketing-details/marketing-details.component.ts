import { Component, OnInit } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, listings_add, listings_edit } from 'src/app/shared/toast-message-text';
import { Listing } from '../../../listings/listing.model';
import { ListingService } from '../../../listings/listing.service';
import { Properties } from '../../properties.model';
import { PropertiesService } from '../../properties.service';


@Component({
  selector: 'app-marketing-details',
  templateUrl: './marketing-details.component.html',
  styleUrls: ['./marketing-details.component.scss']
})
export class MarketingDetailsComponent implements OnInit {

  public Editor = ClassicEditor;
  list: Listing;
  descriptionData = '<p>Start typing here...</p>';
  property: Properties;
  isNewListing: boolean = false;
  isSaving:boolean = false;
  utilitiesList: string[];
  constructor(private listingService: ListingService,
    private toastr: ToastrService,
    private propertiesService: PropertiesService) {
    this.property = new Properties();
    this.list = new Listing();
    this.list.savings = 0;
    this.propertiesService.propertyOnParent.subscribe((property) => {
      this.property = property
      this.initialize()
    })
    this.utilitiesList = [
      "City electric",
      "Sewer",
      "Sewer needed",
      "Electric needed",
      "Sewer and electric needed",
      "Not sure"
    ]
  }

  ngOnInit(): void {
    if(!this.property?.id && history.state.data?.id)
      this.property = history.state.data;
    this.initialize()
  }
  initialize() {
    if (this.property && this.property.listingId) {
      this.isNewListing = false;
      this.GetList(this.property.listingId);
    } else {
      this.isNewListing = true;
      this.list.apn = this.property.apn;
      this.list.country = this.property.countyName;
      this.list.address = this.property.propertyAddress;
      this.list.zoning = this.property.zoning;
      this.list.description = this.property.landUseDescription;
      this.descriptionData = this.list.description;
    }
  }

  GetList(listId: string) {
    this.isSaving = true;
    this.listingService.Get(listId).subscribe((data: any) => {
      this.list = data;
      this.isSaving = false;
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(common_error_message);
    })
  }


  save() {
    if (this.isNewListing) {
      const utls = [];
      const utilities = document.getElementById('utilities-edit');
      if (utilities != null) {
        const options = utilities['options'];
        if (options && options.length > 0) {
          for (const option of options) {
            if (option.selected) {
              utls.push(option.value);
            }
          }
        }
      }
      this.list.utilities = utls;
      this.isSaving = true;
      this.list.PropertyId = this.property.id;
      this.listingService.Save(this.list).subscribe((data: any) => {
        this.GetProperty();
        this.UpdatePropertiesResource(data);
        this.isSaving = false;
      }, (error) => {
        this.isSaving = false;
        this.toastr.error(listings_add.add_list_error);
      })
    } else {
      this.Update();
    }
  }

  GetProperty() {
    this.propertiesService.GetProperties(this.property.id).subscribe((data: any) => {
      this.property = data;
      this.propertiesService.updatePropertyOnParent(this.property);
    }, (error) => {
      this.toastr.error(common_error_message);
    })
  }

  Update() {
    this.isSaving = true;
    this.list.PropertyId = this.property.id;
    this.listingService.Update(this.list).subscribe((data: any) => {
      this.isSaving = false;
      this.toastr.info(listings_edit.edit_list_success);
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(listings_edit.edit_list_error);
    })
  }

  onChangeData (val) {
    let savings = this.list.marketValue - this.list.listingPrice;
    this.list.savings = savings / 100 + savings % 100;
  }

  UpdatePropertiesResource(listId: string) {
    this.isSaving = true;
    this.propertiesService.UpdatePropertiesResource(this.property.id, [listId], 'listing').subscribe((data: any) => {
      this.isSaving = false;
      this.toastr.info(listings_add.add_list_success);
      this.propertiesService.reloadTimeline();
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(common_error_message);
    })
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.list.description = data;
  }

}
