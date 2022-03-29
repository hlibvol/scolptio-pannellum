import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, s3_document } from 'src/app/shared/toast-message-text';
import { S3BucketService } from '../../../../shared/s3-bucket.service';
import { PropertyFile } from '../../../../shared/shared.model';
import { FileUpload } from '../../../properties/properties.model';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  @Input()
  projectId:string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  documents: PropertyFile[];
  isSaving = false;

  constructor(private s3BucketService: S3BucketService,
    private projectService: ProjectService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetFiles();
  }

  GetFiles() {
    this.isSaving = true;
    this.projectService.GetDocuments(this.projectId, this.documentType).subscribe((data: any) => {
      this.documents = data.map(x => {
        return {
          name: x.fileName,
          uploadDate: x.uploadDateTime,
          fileKey: x.s3FileName
        }
      });
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
    this.projectService.AddFile(documentUpload).subscribe((data: any) => {
      if(!this.documents?.length)
        this.documents = [];
      this.documents.push({
        extension: documentUpload.extension,
        fileKey: documentUpload.fileKey,
        url: documentUpload.url,
        name: documentUpload.fileName,
        uploadDate: new Date().toString()
      })
      this.UpdatePropertiesResource();
    }, (error) => {

    })
  }

  UpdatePropertiesResource() {
    var payload = this.documents.map(x => {
      return {
        key: x.fileKey,
        value: x.name
      }
    })
    this.projectService.UpdateProjectResource(this.projectId, payload, this.documentType).subscribe((data: any) => {
    }, (error) => {
      this.toastr.error(common_error_message);
    })
  }

  DeleteFile(fileId: string) {
    this.projectService.DeleteDocument(fileId).subscribe((data: any) => {
      this.toastr.info(s3_document.document_delete_success);
      const index = this.documents.findIndex(x => x.fileKey === fileId);
      if (index > -1) {
        this.documents.splice(index, 1);
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
