import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModelFileService } from 'src/app/shared/model-file.service';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import { PropertyFile } from 'src/app/shared/shared.model';
import { common_error_message, s3_model } from 'src/app/shared/toast-message-text';
import { FileUpload } from 'src/app/view/properties/properties.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

declare var $: any;
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  @Input() projectId: string = '';
  @Input() header: string = '';

  entryid: string = "";
  entryUrl: SafeUrl;
  path: string = "";
  type: string = "";
  models: PropertyFile[];
  modelList = [];
  isSaving = false;
  folderName: string;

  constructor(private s3BucketService: S3BucketService,
    private modelFileService: ModelFileService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer) {
      this.sanitizer = sanitizer;  
  }

  ngOnInit(): void {
    this.GetModelFiles();
  }

  GetModelFiles() {
    this.isSaving = true;
    this.modelFileService.GetAllModelFiles({ projectId: this.projectId }).subscribe((data: any) => {
      this.models = data.map(x => {
        return {
          id: x.id,
          name: x.fileName,
          folderName: x.folderName,
          fileKey: x.s3FileName,
          uploadDate: x.uploadDateTime
        }
      });
      this.isSaving = false;
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(common_error_message);
    })
  }

  ModelUploadSuccess(modelUploads: FileUpload[]) {
    for (let modelUpload of modelUploads) {
      this.AddModelFile(modelUpload);
      this.folderName = modelUpload.folderName;
    }
    $("#uploadTexture").modal("toggle");
  }

  TextureUploadSuccess(data: any) {
    console.log(data);
  }

  AddModelFile(modelUpload: FileUpload) {
    let requestBody = {
      projectId: this.projectId,
      s3FileName: modelUpload.fileKey,
      fileName: modelUpload.fileName,
      folderName: modelUpload.folderName
    }
    this.modelFileService.UploadModelFile(requestBody).subscribe((data: any) => {
      if (!this.models?.length)
        this.models = [];
      this.models.push({
        id: data,
        name: modelUpload.fileName,
        folderName: modelUpload.folderName,
        fileKey: modelUpload.fileKey,
        uploadDate: new Date().toString()
      })
      // this.toastr.info(s3_model.model_add_success);
    }, (error) => {
      this.toastr.error(s3_model.model_add_error);
    })
  }

  DeleteFile(fileId: string) {
    this.modelFileService.DeleteModelFile(fileId).subscribe((data: any) => {
      this.toastr.info(s3_model.model_delete_success);
      const index = this.models.findIndex(x => x.id === fileId);
      if (index > -1) {
        this.models.splice(index, 1);
      }
    }, (error) => {
      this.toastr.error(s3_model.model_delete_error);
    })
  }

  async DownloadFile(doc: PropertyFile) {
    this.toastr.info(s3_model.download_model_info);
    const url = await this.s3BucketService.GetUrl(`${doc.folderName}/${doc.fileKey}`);
    this.path = url;
    this.type = doc.fileKey
    $("#playModel").modal("toggle");
  }

  photoURL() {
    this.entryid = "https://api.echo3D.co/webar?key=sparkling-frog-6857&entry=00dcd7e5-f497-4345-83ce-b74b73feed8f";
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.entryid);
  }

  async DownloadFileFromEcho3D(doc: PropertyFile) {
    // this.toastr.info(s3_model.download_model_info);
    // const url = await this.s3BucketService.GetUrl(`${doc.folderName}/${doc.fileKey}`);
    // this.path = url;
    this.entryid = "https://api.echo3D.co/webar?key=sparkling-frog-6857&entry="+doc.fileKey;
    this.entryUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.entryid);
    console.log("xxx_docurl",doc.url);
    console.log("xxx_entryurl",this.entryUrl);
    console.log("xxx_Doc",doc);
    // this.type = doc.fileKey
    $("#echo3dModel").modal("toggle");
  }

  UploadTextureFile(doc: PropertyFile) {
    this.folderName = doc.folderName;
    $("#uploadTexture").modal("toggle");
  }

  sort(event: PointerEvent) {
    console.log(event);
    let target = <HTMLElement>event.target;
    switch (target.className) {
      case "fa fa-fw fa-sort":
      case "fa fa-fw fa-sort-asc":
        this.models.sort((a, b) => (b.uploadDate >= a.uploadDate) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-desc";
        break;
      case "fa fa-fw fa-sort-desc":
      default:
        this.models.sort((a, b) => (a.uploadDate >= b.uploadDate) ? 1 : -1);
        target.className = "fa fa-fw fa-sort-asc";
        break;
    }
  }
}
