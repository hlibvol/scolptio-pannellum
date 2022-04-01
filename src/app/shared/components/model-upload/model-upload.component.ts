import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigsLoaderService } from 'src/app/services/configs-loader.service';
import { FileUpload } from 'src/app/view/properties/properties.model';
import { S3BucketService } from '../../s3-bucket.service';
import { S3File } from '../../shared.model';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

declare var $: any;
@Component({
  selector: 'app-s3-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.scss']
})
export class ModelUploadComponent implements OnInit {
  @ViewChild('myS3ModelInput') myS3ModelInput: ElementRef;

  @Output() ModelUploadSuccessEvent = new EventEmitter<FileUpload[]>();

  modelFiles: S3File[];
  modelList: any;
  isSaving = 0;
  fileUploads: FileUpload[];
  hasSucces = false;
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private _injector: Injector,
    private toastr: ToastrService, private s3BucketService: S3BucketService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.modelFiles = new Array();
    this.fileUploads = new Array();
  }

  ngOnInit(): void {
    
  }

  close() {
    if (this.fileUploads && this.fileUploads.length > 0) {
      this.ModelUploadSuccessEvent.emit(this.fileUploads);
    }
    this.removeModel();
    $('#uploadModel').modal('toggle');
  }

  removeModel() {
    this.modelFiles = null;
    this.myS3ModelInput.nativeElement.value = "";
    this.modelFiles = new Array();
    this.fileUploads = new Array();
    this.hasSucces = false;
    this.isSaving = 0;
  }

  prepareView() {
    setTimeout(() => {
      if (this.modelList != null && this.modelList.length > 0) {
        for (let model of this.modelList) {
          const modelFile = new S3File();
          modelFile.file = model;
          this.modelFiles.push(modelFile);
        }
      }
    }, 500);
  }

  onChangeModel($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.modelList = files;
      this.prepareView();
    }
  }

  upload() {
    for (let model of this.modelFiles) {
      setTimeout(() => {
        this.uploadModels(model);
      }, 500);
    }
  }

  public uploadModels(modelFile: S3File) {

    const extension = (/[.]/.exec(modelFile.file.name)) ? /[^.]+$/.exec(modelFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const modelFileName = uuid + '.' + extension;

    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params = {
      Bucket: "scolptio-crm-bucket",
      Key: modelFileName,
      Body: modelFile.file
    };

    const command = new PutObjectCommand(params);
    this.isSaving++;
    modelFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        modelFile.status = 'success';
        const modelUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${modelFileName}`;

        const modelUpload = new FileUpload();
        modelUpload.fileName = modelFile.file.name;
        modelUpload.fileKey = modelFileName;
        modelUpload.extension = extension;
        modelUpload.fileSize = modelFile.file.size.toString();
        modelUpload.url = modelUrl;
        
        this.fileUploads.push(modelUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        modelFile.status = 'error';
      }
    );
  }
}
