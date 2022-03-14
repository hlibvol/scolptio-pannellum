import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../shared/data-service';
import { Properties } from '../properties.model';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  isLoading = false;
  property: Properties;
  constructor(private activatedRoute: ActivatedRoute,
      private propertiesService: PropertiesService,
      public dataService: DataService,
      private toastr: ToastrService) { 
    this.propertiesService.propertyOnParent.subscribe((property)=>{
      this.property = property;
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        try{
          const id = params['id'];
          this.isLoading = true;
          this.property = await this.propertiesService.GetProperties(id).toPromise();                                            
          this.propertiesService.updatePropertyOnParent(this.property);
          this.isLoading = false;
        }
        catch(error){
          this.isLoading = false;
          this.dataService.property = null;
          this.toastr.error('Something went wrong. Please try again later.');
        }
      } else {
        this.toastr.error('Something went wrong. Please try again later.');
      }
    });
  }

}
