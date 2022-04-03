import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from '../../../view/properties/properties.model';
import { S3File } from '../../shared.model';
import { S3BucketService } from '../../s3-bucket.service';

declare var $: any;
@Component({
  selector: 'app-s3-multi-image-upload',
  templateUrl: './multi-image-upload.component.html',
  styleUrls: ['./multi-image-upload.component.scss']
})
export class MultiImageUploadComponent implements OnInit {
  @ViewChild('myS3MultiImageInput') myS3MultiImageInput: ElementRef;

  @Output() ImageUploadSuccessEvent = new EventEmitter<FileUpload[]>();

  imageFiles: S3File[];
  imageList: any;
  isSaving = 0;
  fileUploads: FileUpload[];
  hasSucces = false;
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private _injector: Injector,
    private toastr: ToastrService, private s3BucketService: S3BucketService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.imageFiles = new Array();
    this.fileUploads = new Array();
  }

  ngOnInit(): void { }

  close() {
    if (this.fileUploads && this.fileUploads.length > 0) {
      this.ImageUploadSuccessEvent.emit(this.fileUploads);
    }
    this.removeImage();
    $('#uploadMultiImage').modal('toggle');
  }

  removeImage() {
    this.imageFiles = null;
    this.myS3MultiImageInput.nativeElement.value = "";
    this.imageFiles = new Array();
    this.fileUploads = new Array();
    this.hasSucces = false;
    this.isSaving = 0;
  }

  prepareView() {
    setTimeout(() => {
      if (this.imageList != null && this.imageList.length > 0) {
        for (let img of this.imageList) {
          const imgFile = new S3File();
          imgFile.file = img;
          this.imageFiles.push(imgFile);
        }
      }
    }, 500);
  }

  onChangeImage($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.imageList = files;
      this.prepareView();
    }
  }

  upload() {
    for (let img of this.imageFiles) {
      setTimeout(() => {
        this.uploadImages(img);
      }, 500);
    }
  }

  public uploadImages(imgFile: S3File) {

    const extension = (/[.]/.exec(imgFile.file.name)) ? /[^.]+$/.exec(imgFile.file.name)[0] : undefined;
    const uuid = uuidv4();
    const imageFileName = uuid + '.' + extension;

    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params = {
      Bucket: "scolptio-crm-bucket",
      Key: imageFileName,
      Body: imgFile.file
    };

    const command = new PutObjectCommand(params);
    this.isSaving++;
    imgFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        imgFile.status = 'success';
        const imageUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${imageFileName}`;

        const imageUpload = new FileUpload();
        imageUpload.fileName = imgFile.file.name;
        imageUpload.fileKey = imageFileName;
        imageUpload.extension = extension;
        imageUpload.fileSize = imgFile.file.size.toString();
        imageUpload.url = imageUrl;
        
        this.fileUploads.push(imageUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        imgFile.status = 'error';
      }
    );
  }

}