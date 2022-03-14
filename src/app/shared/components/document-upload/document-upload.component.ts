import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from '../../../view/properties/properties.model';
import { S3File } from '../../shared.model';

declare var $: any;
@Component({
  selector: 'app-s3-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  @ViewChild('myS3DocumentInput') myS3DocumentInput: ElementRef;

  @Output() DocumentUploadSuccessEvent = new EventEmitter<FileUpload[]>();

  documentFiles: S3File[];
  documentList: any;
  isSaving = 0;
  docType = null;
  docFiles: S3File[];
  hasSucces = false;
  fileUploads: FileUpload[];

  protected _configLoaderService: ConfigsLoaderService;

  constructor(private _injector: Injector,
    private toastr: ToastrService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.documentFiles = new Array();
    this.fileUploads = new Array();
  }

  ngOnInit(): void { }

  close() {

    if (this.fileUploads && this.fileUploads.length > 0) {
      this.DocumentUploadSuccessEvent.emit(this.fileUploads);
    }

    this.docType = null;
    this.documentFiles = new Array();
    this.fileUploads = new Array();
    this.myS3DocumentInput.nativeElement.value = "";
    this.hasSucces = false;
    this.isSaving = 0;

    $('#uploadNewDoc').modal('toggle');
  }

  prepareView() {
    setTimeout(() => {
      if (this.documentList != null && this.documentList.length > 0) {
        for (let doc of this.documentList) {
          const docFile = new S3File();
          docFile.file = doc;
          this.documentFiles.push(docFile);
        }
      }
    }, 500);
  }

  onChangeDocument($event: Event) {
    const files = ($event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.documentList = files;
      this.prepareView();
    }
  }

  upload() {
    for (let img of this.documentFiles) {
      setTimeout(() => {
        this.uploadDocument(img);
      }, 500);
    }
  }

  public uploadDocument(documentFile: S3File) {

    const extension = (/[.]/.exec(documentFile.file.name)) ? /[^.]+$/.exec(documentFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const documentFileName = uuid + '.' + extension;

    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAQ7DY7O7IM4XWIN5I",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params = {
      Bucket: "ph-saas-bucket-us-east-2",
      Key: documentFileName,
      Body: documentFile.file
    };

    const command = new PutObjectCommand(params);
    this.isSaving++;
    documentFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        documentFile.status = 'success';
        const documentUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${documentFileName}`;

        const documentUpload = new FileUpload();
        documentUpload.fileName = documentFile.file.name;
        documentUpload.fileKey = documentFileName;
        documentUpload.extension = extension;
        documentUpload.fileSize = documentFile.file.size.toString();
        documentUpload.url = documentUrl;
        documentUpload.type = this.docType;

        this.fileUploads.push(documentUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        documentFile.status = 'error';

      }
    );
  }

}
