import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PropertyOwnerPipe } from 'src/app/shared/pipes/property-owner.pipe';
import { PropertyGridPipe } from 'src/app/shared/pipes/property-grid.pipe';



@NgModule({
  declarations: [
    CampaignListComponent,
    PropertyOwnerPipe,
    PropertyGridPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path:'',
        component : CampaignListComponent,
      },
      {
        path:'action/:page/:action',
        component : CampaignListComponent,
      },
      {
        path:':propertyId',
        component : CampaignListComponent,
      },
      {
        path:':propertyId/:campaignId',
        component : CampaignListComponent,
      }
    ])
  ],
  providers:[
    PropertyOwnerPipe
  ]
})
export class CampaignModule { }
