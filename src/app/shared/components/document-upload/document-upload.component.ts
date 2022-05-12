import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { S3File } from '../../shared.model';
import { ProjectS3DocumentItem } from '../../models/s3-items-model';
import { ProjectService } from 'src/app/view/projects/project.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
@Component({
  selector: 'app-s3-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  @ViewChild('myS3DocumentInput') myS3DocumentInput: ElementRef;

  @Output() DocumentUploadSuccessEvent = new EventEmitter<ProjectS3DocumentItem[]>();

  documentFiles: ProjectS3DocumentItem[];
  documentList: any;
  isSaving = 0;
  hasSucces = false;
  fileUploads: ProjectS3DocumentItem[];

  constructor(private projectService: ProjectService,
    private sanitizer: DomSanitizer) {
    this.documentFiles = [];
    this.fileUploads = [];
  }

  ngOnInit(): void { }

  close() {

    if (this.fileUploads && this.fileUploads.length > 0) {
      this.DocumentUploadSuccessEvent.emit(this.fileUploads);
    }
    this.documentFiles = [];
    this.fileUploads = [];
    this.myS3DocumentInput.nativeElement.value = "";
    this.hasSucces = false;
    this.isSaving = 0;

    $('#uploadNewDoc').modal('toggle');
  }

  prepareView() {
    if (this.documentList != null && this.documentList.length > 0) {
      for (let doc of this.documentList) {
        const docFile = new ProjectS3DocumentItem(this.sanitizer, '');
        docFile.file = doc;
        this.documentFiles.push(docFile);
      }
    }
  }

  onChangeDocument($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.documentList = files;
      this.prepareView();
    }
  }

  async upload(): Promise<void> {
    await Promise.all(this.documentFiles.map(x => this.uploadDocument(x)))
  }

  public async uploadDocument(documentFile: S3File) {
    try{
      this.isSaving++;
      documentFile.status = 'uploading';
      let formData = new FormData();
      formData.append('fileData', documentFile.file);
      let {s3Key, safeUrl} = await this.projectService.uploadToS3(formData).toPromise()
      let file = new ProjectS3DocumentItem(this.sanitizer, safeUrl as string);
      file.s3Key = s3Key;
      file.file = documentFile.file;
      file.fileName = documentFile.file.name;
      documentFile.status = 'success'
      this.fileUploads.push(file);
      this.hasSucces = true;
    }
    catch{
      documentFile.status = 'error'
    }
    finally{
      this.isSaving--;
    }
  }
}
