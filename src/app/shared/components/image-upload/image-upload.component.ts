import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from '../../../view/properties/properties.model';
import { s3_image } from '../../toast-message-text';

declare var $: any;
@Component({
  selector: 'app-s3-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('myS3ImageInput') myS3ImageInput: ElementRef;

  @Output() ImageUploadSuccessEvent = new EventEmitter<FileUpload>();

  imgUrl: string;
  imageData: string;
  imageFile: any;
  isSaving = false;
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private _injector: Injector,
    private toastr: ToastrService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
  }

  ngOnInit(): void { }

  removeImage() {
    this.imageData = null;
    this.myS3ImageInput.nativeElement.value = "";
  }

  onChangeImg($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    if (file) {
      this.isSaving = true;
      this.imageFile = file;
      this.convertToBase64(this.imageFile);
    }
  }

  private convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((data) => {
      this.imageData = data;
      this.isSaving = false;
    });
  }

  private readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    }

    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    }
  }

  onPageChange(pageNumber: number) {
    // this.ImageUploadSuccessEvent.emit(pageNumber.toString());

  }


  public uploadImage() {

    if (this.imageFile) {

      const extension = (/[.]/.exec(this.imageFile.name)) ? /[^.]+$/.exec(this.imageFile.name)[0] : undefined;
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
        Body: this.imageFile
      };

      const command = new PutObjectCommand(params);
      this.isSaving = true;
      client.send(command).then(
        (data) => {
          this.isSaving = false;
          const imageUrl = `https://${this._configLoaderService.bucket}.s3.${this._configLoaderService.region}.amazonaws.com/${imageFileName}`;

          const imageUpload = new FileUpload();
          imageUpload.fileName = this.imageFile.name;
          imageUpload.fileKey = imageFileName;
          imageUpload.extension = extension;
          imageUpload.fileSize = this.imageFile.size;
          imageUpload.url = imageUrl;
          this.ImageUploadSuccessEvent.emit(imageUpload);
          this.toastr.info(s3_image.image_add_success);
          this.removeImage();
        },
        (error) => {
          // error handling.
          this.isSaving = false;
          this.toastr.error(s3_image.image_add_error);
        }
      );
    }
  }

}
