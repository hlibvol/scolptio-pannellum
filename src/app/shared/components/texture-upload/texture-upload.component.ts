import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigsLoaderService } from 'src/app/services/configs-loader.service';
import { FileUpload } from 'src/app/view/properties/properties.model';
import { S3BucketService } from '../../s3-bucket.service';
import { S3File } from '../../shared.model';
import { PutObjectCommand, PutObjectRequest, S3Client } from '@aws-sdk/client-s3';

declare var $: any;
@Component({
  selector: 'app-s3-texture-upload',
  templateUrl: './texture-upload.component.html',
  styleUrls: ['./texture-upload.component.scss']
})
export class TextureUploadComponent implements OnInit {
  @ViewChild('myS3TextureInput') myS3TextureInput: ElementRef;

  @Output() TextureUploadSuccessEvent = new EventEmitter<any>();
  @Input() folderName: any;

  textureFiles: S3File[];
  textureList: any;
  isSaving = 0;
  fileUploads: FileUpload[];
  hasSucces = false;
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private _injector: Injector,
    private toastr: ToastrService, private s3BucketService: S3BucketService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
    this.textureFiles = new Array();
    this.fileUploads = new Array();
  }

  ngOnInit(): void {
  }

  close() {
    if (this.fileUploads && this.fileUploads.length > 0) {
      this.TextureUploadSuccessEvent.emit(this.fileUploads.length);
    }
    this.removeTexture();
    $('#uploadTexture').modal('toggle');
  }

  removeTexture() {
    this.textureFiles = null;
    this.myS3TextureInput.nativeElement.value = "";
    this.textureFiles = new Array();
    this.fileUploads = new Array();
    this.hasSucces = false;
    this.isSaving = 0;
  }

  prepareView() {
    setTimeout(() => {
      if (this.textureList != null && this.textureList.length > 0) {
        for (let texture of this.textureList) {
          const textureFile = new S3File();
          textureFile.file = texture;
          this.textureFiles.push(textureFile);
        }
      }
    }, 500);
  }

  onChangeTexture($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.textureList = files;
      this.prepareView();
    }
  }

  upload() {
    for (let texture of this.textureFiles) {
      setTimeout(() => {
        this.uploadTextures(texture);
      }, 500);
    }
  }

  public uploadTextures(textureFile: S3File) {
    const extension = (/[.]/.exec(textureFile.file.name)) ? /[^.]+$/.exec(textureFile.file.name)[0] : undefined;
    const client = new S3Client({
      credentials: {
        accessKeyId: "AKIAYRELZPYTB44GTA42",
        secretAccessKey: "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"
      },
      region: "us-east-2"
    });

    const params: PutObjectRequest = {
      ACL: "public-read",
      Bucket: "scolptio-crm-bucket",
      Key: `${this.folderName}/${textureFile.file.name}`,
      Body: textureFile.file,
    };

    const command = new PutObjectCommand(params);
    this.isSaving++;
    textureFile.status = 'uploading';
    client.send(command).then(
      (data) => {
        this.isSaving--;
        textureFile.status = 'success';
        const textureUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${this.folderName}/${textureFile.file.name}`;

        const textureUpload = new FileUpload();
        textureUpload.fileName = textureFile.file.name;
        textureUpload.folderName = this.folderName;
        textureUpload.fileKey = textureFile.file.name;
        textureUpload.extension = extension;
        textureUpload.fileSize = textureFile.file.size.toString();
        textureUpload.url = textureUrl;

        
        this.fileUploads.push(textureUpload);
        this.hasSucces = true;
      },
      (error) => {
        // error handling.
        this.isSaving--;
        textureFile.status = 'error';
      }
    );
  }
}
