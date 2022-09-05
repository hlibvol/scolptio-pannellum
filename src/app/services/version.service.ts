import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/base.service';
import { Version } from '../view/projects/version/version.model';

@Injectable({
  providedIn: 'root'
})
export class VersionService extends BaseService {

  constructor(_injector: Injector) { 
    super(_injector)
  }
  create(projectId: string, documentType: string, versionName: string): Observable<Version> {
    return this.post('Version/Create', {projectId, documentType, versionName })
  }
  getVersions(projectId: string, documentType: string): Observable<Version[]> {
    return this.get(`Version/GetAll?projectId=${projectId}&documentType=${documentType}`);
  }
  update(version: Version): Observable<any> {
    return this.put('Version/Update', version)
  }
  delete(id: string): Observable<any> {
    return super.delete('Version/Delete?id=' + id)
  }
}
