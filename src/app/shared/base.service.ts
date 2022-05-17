import { Injectable, Injector } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigsLoaderService } from '../services/configs-loader.service';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private baseUrl = '';
  private echo3dUrl = '';
  protected httpClient: HttpClient;
  protected _configLoaderService: ConfigsLoaderService
  constructor(private _injector: Injector) {
    this.httpClient = _injector.get(HttpClient);
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.baseUrl = this._configLoaderService.ApiUrl;
    this.echo3dUrl = this._configLoaderService.echo3dUrl;
  }

  public postecho3dC<T>(
    url: string,
    data: Object,
    // options: Object | string,
    responseType?: Object | string
  ): Observable<T> {
    return this.httpClient.post<T>('https://localhost:5001/api/File/UploadEcho3DBlob', data, responseType?responseType:{});
  }



  public post<T>(
    url: string,
    data: Object | string,
    responseType?: Object | string
  ): Observable<T> {
    return this.httpClient.post<T>(this.baseUrl + url, data, responseType ? responseType : {});
  }
  public get<T>(url: string, options?: Object | string): Observable<T> {
    return this.httpClient.get<T>(this.baseUrl+url, options ? options : {});
  }
  public put<T>(url: string, data: Object | string, options?: Object | string): Observable<T> {
    return this.httpClient.put<T>(this.baseUrl + url, data, options ? options : {});
  }
  public delete<T>(url: string, options?: Object | string): Observable<T> {
    return this.httpClient.delete<T>(this.baseUrl+url, options ? options : {});
  }
}
