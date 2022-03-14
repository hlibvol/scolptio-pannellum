import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigsLoaderService } from '../services/configs-loader.service';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private baseUrl = '';
  protected httpClient: HttpClient;
  protected _configLoaderService: ConfigsLoaderService
  constructor(private _injector: Injector) {
    this.httpClient = _injector.get(HttpClient);
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.baseUrl = this._configLoaderService.ApiUrl;
  }

  public post<T>(
    url: string,
    data: Object | string,
    responseType?: Object | string
  ): Observable<T> {
    return this.httpClient.post<T>(this.baseUrl + url, data, responseType ? responseType : {});
  }
  public get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(this.baseUrl+url);
  }
  public put<T>(url: string, data: Object | string): Observable<T> {
    return this.httpClient.put<T>(this.baseUrl + url, data);
  }
  public delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(this.baseUrl+url);
  }
}
