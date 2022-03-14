import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from 'src/app/shared/base.service';
import { CampaignModule } from './campaign.module';

@Injectable({
  providedIn: CampaignModule,
})
export class CampaignService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  getProperties() {
    return this.get('Property/api/Property/GetProperties');
  }
}
