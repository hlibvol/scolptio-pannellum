import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/base.service';

@Injectable()
export class PropertyDocumentService extends BaseService {
  constructor(_injector: Injector) {
    super(_injector);
  }

  createPropertyDocument(data: any) {
    const requestURL = "PropertyDocument/Add"
    return this.post(requestURL, data)
  }

  getAllPropertyDocument(orgId) {
    const requestURL = "PropertyDocument/GetAll?orgId=" + orgId
    return this.get(requestURL)
  }

  deletePropertyDocument(documentId) {
    const requestURL = "PropertyDocument/Delete"
    return this.post(requestURL, { "documentId": documentId })
  }

  updatePropertyDocument(data: any) {
    const requestURL = "PropertyDocument/Update"
    return this.post(requestURL, data)
  }

}
