import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../shared/data-service';
import { Properties } from '../../properties.model';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  propertySubscription: Subscription;
  isLoading = true;
  property: Properties;
  constructor(
    public dataService: DataService,
    private propertiesService: PropertiesService) {
      this.propertiesService.propertyOnParent.subscribe((property) => {
        this.property = property
      })
  }
  ngOnInit(): void {
    if(!this.property)
      this.property = history.state.data;
    this.isLoading = false;
  }

}
