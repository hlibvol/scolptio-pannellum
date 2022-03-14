import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../shared/base.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) {
  }

  getProperties(pageNumber: number, pageSize: number) {
    const requestBody = {
      pageNumber,
      pageSize
    };
    const requestURL = this.baseUrl + "Properties/GetAll"
    return this._http.post(requestURL, requestBody)
  }

  getPropertiesTotalCount() {
    const requestURL = this.baseUrl + "Properties/GetTotalCount"
    return this._http.get(requestURL)
  }

  getPropertyStatusList() {
    const requestURL = this.baseUrl + "Properties/GetPropertyStatus"
    return this._http.get(requestURL)
  }

  getMailPricingList() {
    const requestURL = this.baseUrl + "Mailhouse/GetPricing"
    return this._http.get(requestURL)
  }

  createCampaign(data: any) {
    const requestURL = this.baseUrl + "Campaign/Add"
    return this._http.post(requestURL, data)
  }

  getAllCampaign(orgId) {
    const requestURL = this.baseUrl + "Campaign/GetAll?orgId=" + orgId
    return this._http.get(requestURL)
  }

  deleteCampaign(campaignId) {
    const requestURL = this.baseUrl + "Campaign/Delete"
    return this._http.post(requestURL, { "campaignId": campaignId })
  }

  updateCampaign(data: any) {
    const requestURL = this.baseUrl + "Campaign/Update"
    return this._http.post(requestURL, data)
  }

}
