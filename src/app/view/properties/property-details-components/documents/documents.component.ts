import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, s3_document } from 'src/app/shared/toast-message-text';
import { S3BucketService } from '../../../../shared/s3-bucket.service';
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import { PropertyFile } from '../../../../shared/shared.model';
import { FileUpload, Properties } from '../../properties.model';
import { PropertiesService } from '../../properties.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {


  property: Properties;
  documents: PropertyFile[];
  isSaving = false;

  constructor(private s3BucketService: S3BucketService,
    private propertiesService: PropertiesService,
    private toastr: ToastrService,
    private appSessionStorageService: AppSessionStorageService) {
      this.propertiesService.propertyOnParent.subscribe((property) => {
        this.property = property
        this.initializeFiles();
      })
  }

  ngOnInit(): void {
    if(!this.property)
      this.property = history.state.data;
    this.initializeFiles();
  }
  initializeFiles() {
    if (this.property.documents == null) {
      this.property.documents = [];
    } else if (this.property.documents.length > 0) {
      this.GetFiles();
    }
  }

  GetFiles() {
    this.isSaving = true;
    this.propertiesService.GetFiles(this.property.documents).subscribe((data: any) => {
      this.documents = data;
      this.isSaving = false;
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(common_error_message);
    })
  }

  DocumentUploadSuccessEvent(documentUploads: FileUpload[]) {
    for (let documentUpload of documentUploads) {
      this.AddDocumentFile(documentUpload);
    }
  }

  AddDocumentFile(documentUpload: FileUpload) {
    this.propertiesService.AddFile(documentUpload).subscribe((data: any) => {
      this.property.documents.push(documentUpload.fileKey);
      this.UpdatePropertiesResource();
    }, (error) => {

    })
  }

  UpdatePropertiesResource() {
    this.propertiesService.UpdatePropertiesResource(this.property.id, this.property.documents, 'documents').subscribe((data: any) => {
      this.propertiesService.updatePropertyOnParent(this.property);
    }, (error) => {
      this.toastr.error(common_error_message);
    })
  }

  DeleteFile(fileId: string) {
    this.propertiesService.DeleteFile(fileId).subscribe((data: any) => {
      this.toastr.info(s3_document.document_delete_success);
      const propertyDocIndex = this.property.documents.findIndex(key => key === fileId);
      if (propertyDocIndex > -1) {
        this.property.documents.splice(propertyDocIndex, 1);
        this.UpdatePropertiesResource();
      }
    }, (error) => {
      this.toastr.error(s3_document.document_delete_error);
    })
  }

  async DownloadFile(doc: PropertyFile) {
    this.toastr.info(s3_document.download_document_info);
    const url = await this.s3BucketService.GetUrl(doc.fileKey);
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      a.click();
    }
  }

}
