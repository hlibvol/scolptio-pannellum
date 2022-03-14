import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../properties.service';
import { ToastrService } from 'ngx-toastr';
import { Properties } from '../../properties.model';
import { deligence_add } from '../../../../shared/toast-message-text';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';

@Component({
  selector: 'app-due-deligence',
  templateUrl: './due-deligence.component.html',
  styleUrls: ['./due-deligence.component.scss']
})

export class DueDeligenceComponent implements OnInit {
  isSaving = false;
  isLoading = true;
  isDisabled = true;
  errorMsg: string;
  property: Properties;

  constructor(private propertiesService: PropertiesService, private toastr: ToastrService) {
    this.propertiesService.propertyOnParent.subscribe((property) => {
      this.property = property
    })
  }

  ngOnInit(): void {
    this.property = history.state.data;
    this.isLoading = false;
  }

  save() {
    let deligence = {
      PropertiesId: localStorage.getItem('propertyID'),
      totalAssessedValue: this.property.totalAssessedValue,
      propertyDimension: this.property.propertyDimension,
      hoaRestriction: this.property.hoaRestriction,
      zoningRestriction: this.property.zoningRestriction,
      accessType: this.property.accessType,
      visualAccess: this.property.visualAccess,
      topography: this.property.topography,
      powerAvailable: this.property.powerAvailable,
      gasAvailable: this.property.gasAvailable,
      pertTest: this.property.pertTest,
      floodZone: this.property.floodZone,
      survey: this.property.survey,
      zoning: this.property.zoning,
      utilities: this.property.utilities,
      IsDueDiligenceTransaction: true
    }

    this.isSaving = true;
    this.propertiesService.UpdateProperty(deligence).subscribe((data: any) => {
      this.toastr.info(deligence_add.add_deligence_success);
      this.isSaving = false;
      this.propertiesService.updatePropertyOnParent(this.property)
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(deligence_add.add_deligence_error);
      this.isSaving = false;
    })
  }

  onChangeData (val) {
    let deligence = {
      marketValue: this.property.totalAssessedValue,
      propertyDimension: this.property.propertyDimension,
      hoaRestriction: this.property.hoaRestriction,
      zoningRestriction: this.property.zoningRestriction,
      accessType: this.property.accessType,
      visualAccess: this.property.visualAccess,
      topography: this.property.topography,
      powerAvailable: this.property.powerAvailable,
      gasAvailable: this.property.gasAvailable,
      pertTest: this.property.pertTest,
      floodZone: this.property.floodZone,
      survey: this.property.survey,
      zoning: this.property.zoning,
      utilities: this.property.utilities
    }
    var values = Object.values(deligence);
    
    for (let i = 0; i < values.length; i ++) {
      if (values[i] == undefined || values[i] == null || values[i] === "undefined" || values[i] == "") {
        this.isDisabled = true;
        break;
      } else
        this.isDisabled = false;
    }
  }
}

