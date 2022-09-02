import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectS3DocumentItem } from 'src/app/shared/models/s3-items-model';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message, s3_document } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { ProjectService } from '../../project.service';
import { SafeUrlService } from '../../../../shared/safe-url.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss', '../../../../../assets/css/app.css']
})
export class DocumentsComponent implements OnInit,OnChanges {

  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  documents: ProjectS3DocumentItem[];
  isSaving = false;
  isDeleteHide: boolean = true;
  isAddHide:boolean=true;
  currentUser:AppUser
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    private appSessionStorageService: AppSessionStorageService,
    private domSanitizer: DomSanitizer,
    private safeUrlService: SafeUrlService) {
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
  async GetFiles(): Promise<void> {
    this.isSaving = true;
    try{
      this.documents = await this.projectService.GetDocuments(this.projectId, this.documentType).toPromise();
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isSaving = false;
    }
  }

  async DocumentUploadSuccessEvent(documentUpload: ProjectS3DocumentItem[]): Promise<void> {
      if (!this.documents?.length)
        this.documents = []
      this.documents = this.documents.concat(documentUpload);
      await this.UpdatePropertiesResource();
      await this.GetFiles(); // Refresh from server. Maybe refresh on client instead for performance?
  }

  async UpdatePropertiesResource(): Promise<void> {
    try{
      this.isSaving = true;
      await this.projectService.UpdateProjectResource(this.projectId, this.documents, this.documentType).toPromise()
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isSaving = false;
    }
  }

  async DeleteFile(item: ProjectS3DocumentItem): Promise<void> {
    try{
      this.isSaving = true;
      const index = this.documents.findIndex(x => x.s3Key === item.s3Key);
      this.documents.splice(index, 1);
      await this.UpdatePropertiesResource();
      this.toastr.info(s3_document.document_delete_success);
    }
    catch{
      this.toastr.error(s3_document.document_delete_error);
    }
    finally{
      this.isSaving = false;
    }
  }

  async DownloadFile(doc: ProjectS3DocumentItem) {
    this.toastr.info(s3_document.download_document_info);
    const blob: Blob = await this.projectService.getS3ObjectBlob(doc.s3Key).toPromise();
    const safeUrl: SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // TO-DO: Check if not sanitizing here is less secure because the <a></a> is removed anyway
    const url: string = this.safeUrlService.getAsString(safeUrl);
    if (url) {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = doc.fileName;
      a.click();
      a.remove();
    }
  }

  async ViewFile(doc: ProjectS3DocumentItem) {
    const url: SafeUrl = await this.projectService.getS3ObjectUrl(doc.s3Key).toPromise();
    this.safeUrlService.open(url);
  }

  sort(event: PointerEvent) {
    console.log(event);
    let target = <HTMLElement>event.target;
    switch (target.className) {
      case "fa fa-fw fa-sort":
      case "fa fa-fw fa-sort-asc":
        this.documents.sort((a, b) => (b.uploadDateTimeUtc >= a.uploadDateTimeUtc) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-desc";
        break;
      case "fa fa-fw fa-sort-desc":
      default:
        this.documents.sort((a, b) => (a.uploadDateTimeUtc >= b.uploadDateTimeUtc) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-asc";
        break;
    }
  }
}
