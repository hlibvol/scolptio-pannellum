import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SettingsService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }
  getAllPlaceholders(): Observable<any[]> {
    const requestURL = this.baseUrl + "Settings/Placeholders";
    return this._http.get<any[]>(requestURL)
  }
}
