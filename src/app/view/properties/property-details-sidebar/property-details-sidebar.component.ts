import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { property_details_sidebar } from 'src/app/shared/toast-message-text';
import { Properties } from '../properties.model';
import { PropertiesService } from '../properties.service';
import { PropertyTimelineVM } from '../property-timeline.view.model';

declare var $: any

@Component({
  selector: 'app-property-details-sidebar',
  templateUrl: './property-details-sidebar.component.html',
  styleUrls: ['./property-details-sidebar.component.scss']
})
export class PropertyDetailsSidebarComponent implements OnInit, OnChanges {

  @Input() selectedProperty: Properties = new Properties();
  
  timeline: PropertyTimelineVM = new PropertyTimelineVM();
  property: Properties;
  propertyStatus: string;
  isSaving = false;
  isLoading = false;
  status: boolean;
  statusTxt: string;
  errorMsg: string;
  
  constructor(private propertiesService: PropertiesService,
    private toastr: ToastrService) {
    this.propertyStatus = null;
    this.statusTxt = "Incomplete";
    this.status = false;
    this.propertiesService.timelineEvent.subscribe(async() => {
      await this.reloadTimeline();
    })
  }

  async ngOnInit(): Promise<void> {
    this.statusTxt = "Incomplete";
    this.status = false;
    this.reloadTimeline()
  }

  async ngOnChanges(): Promise<void> {
    this.property = this.selectedProperty;
    if (this.property?.zoning) {
      this.statusTxt = "Complete";
      this.status = true;
    }
    await this.reloadTimeline()
  }
  async reloadTimeline(): Promise<void> {
    if(this.property && this.property.id){
      var result = await this.propertiesService.GetTimeline(this.property.id).toPromise()
      this.timeline.setSingleDayEventLists(result.singleDayEventLists);
    }
  }

  save() {
    if (this.property.listingId) {
      this.isSaving = true;
      this.propertiesService.UpdatePropertiesStatus(this.property.id, this.propertyStatus).subscribe((data: any) => {
        this.isSaving = false;
        this.toastr.info(property_details_sidebar.property_status_updated_success);
        $('#propertyStatusUpdateModal').modal('toggle');
      }, (error) => {
        this.isSaving = false;
        this.toastr.error(property_details_sidebar.property_status_updated_error);
      })

    } else {
      this.toastr.error(property_details_sidebar.marketing_detail_validation);
    }
  }
}
