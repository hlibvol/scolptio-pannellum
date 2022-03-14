import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentTemplateService {

  baseUrl = environment.baseUrl;
  transactUrl = this.baseUrl + 'Template/Transact';
  constructor(private _http: HttpClient) { }

  getTemplate(id: any) {
    const requestURL = this.baseUrl + "DocumentTemplate?TemplateId=" + id
    return this._http.get(requestURL)
  }

  createTemplate(data: any): Observable<any> {
    return this._http.post(this.transactUrl, data)

  }

  updateTemplate(data: any): Observable<any>{
    return this._http.put(this.transactUrl, data)
  }

  deleteTemplate(templateId: string): Observable<any> {
    return this._http.delete(`${this.transactUrl}?TemplateId=${templateId}`)
  }

  getData(pageNumber: number, pageSize: number, searchKey: string, filterObj: any) {
    const requestBody = {
      pageNumber,
      pageSize,
      searchKey: searchKey,
      filterObj: filterObj
    };
    const requestURL = this.baseUrl + "Template/GetAllTemplates"
    return this._http.post(requestURL, requestBody)
  }

  getTempleteTotalCount() {
    const requestURL = this.baseUrl + "Template/GetTotalCount"
    return this._http.get(requestURL)
  }

}
