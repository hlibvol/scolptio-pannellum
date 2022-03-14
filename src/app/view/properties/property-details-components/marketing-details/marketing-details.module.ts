import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarketingDetailsComponent } from './marketing-details.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ListingService } from '../../../listings/listing.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [MarketingDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MarketingDetailsComponent,
      },
    ]),
    NgSelectModule
  ],
  providers: [ListingService],
})
export class MarketingDetailsModule { }
