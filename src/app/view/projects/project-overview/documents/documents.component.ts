import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message, s3_document } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { PropertyFile } from '../../../../shared/shared.model';
import { FileUpload } from '../../../properties/properties.model';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit,OnChanges {

  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  documents: PropertyFile[];
  isSaving = false;
  isDeleteHide: boolean = true;
  isAddHide:boolean=true;
  currentUser:AppUser
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    private appSessionStorageService: AppSessionStorageService) {
      if (this.appSessionStorageService.getCurrentUser() != null) {
        this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
      }
  }

  ngOnInit(): void {
    this.GetFiles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentUser.Role == "Client" && (changes.documentType.currentValue == "PrerenderedPhotos" ||
      changes.documentType.currentValue == "RenderedPhotos" ||
      changes.documentType.currentValue == "VideosOrAnimations" ||
      changes.documentType.currentValue == "3DModelViewer" ||
      changes.documentType.currentValue == "ARModelViewer")) {
      this.isAddHide = false;
    }
    else if (this.currentUser.Role == "Designer" && (changes.documentType.currentValue == "HandSketchesAndDrawings" ||
      changes.documentType.currentValue == "CADDrawings" ||
      changes.documentType.currentValue == "OtherReferences"
    )) {
      this.isDeleteHide = false;
    }
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
      if (!this.documents?.length)
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
    const url = await this.projectService.getS3ObjectUrl(doc.fileKey).toPromise();
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      a.click();
    }
  }

  sort(event: PointerEvent) {
    console.log(event);
    let target = <HTMLElement>event.target;
    switch (target.className) {
      case "fa fa-fw fa-sort":
      case "fa fa-fw fa-sort-asc":
        this.documents.sort((a, b) => (b.uploadDate >= a.uploadDate) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-desc";
        break;
      case "fa fa-fw fa-sort-desc":
      default:
        this.documents.sort((a, b) => (a.uploadDate >= b.uploadDate) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-asc";
        break;
    }
  }
}
