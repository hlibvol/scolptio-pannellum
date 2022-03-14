import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import Cropper from 'cropperjs';
import { NgxCropperOption } from './ngx-cropper.model';

@Component({
  selector: 'app-ngx-copper',
  templateUrl: './ngx-copper.component.html',
  styleUrls: ['./ngx-copper.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class NgxCopperComponent implements OnInit,AfterViewInit {
  public error = '';
  public isShow = false;
  public applying = false;
  public viewConfig: NgxCropperOption;
  @Input() private config: NgxCropperOption;
  @Output() private returnData: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('inputImage') private inputImage: any;
  @Input() ratioWidth:any;
  @Input() ratioHeight:any;
  @Input() fileSize:any;
  private fileName: string;
  private fileType: string;
  private cropper: Cropper;
  constructor() { }

  ngOnInit() {
    // init config
    this.viewConfig = {
      maxsize: this.fileSize,
      title: 'Apply your image size and position',
      uploadBtnName: 'Upload Image',
      uploadBtnClass: 'hide',
      cancelBtnName: 'Cancel',
      cancelBtnClass: null,
      applyBtnName: 'Apply',
      applyBtnClass: null,
      errorMsgs: { 4000: null, 4001: null },
      fdName: 'file',
      aspectRatio: this.ratioWidth / this.ratioHeight,
      viewMode: 0
    };
  }
  public ngAfterViewInit() {
    //  init upload btn, after dom content loaded init down.
    setTimeout(() => {
      this.inputImage.nativeElement.onchange = () => {
        const files = this.inputImage.nativeElement.files;

        if (files && files.length > 0) {
          this.isShow = true;

          setTimeout(() => {
            this.initCropper();

            const file = files[0];

            // Only can upload image format.
            if (!/^(image\/*)/.test(file.type)) {
              this.returnData.emit(
                JSON.stringify({
                  code: 4002,
                  data: null,
                  msg: `The type you can upload is only image format`
                })
              );
              this.isShow = false;
              return;
            }

            const blobURL = URL.createObjectURL(file);
            this.fileName = file.name;
            this.fileType = file.type;

            this.cropper.replace(blobURL);
          });
        }
      };
    }, 0);
  }
  initCropper() {
    const cropBox = document.getElementById('cropper-image') as HTMLImageElement;
    enum DragMode {
      Crop = 'crop',
      Move = 'move',
      None = 'none',
    }

    const options: Cropper.Options = {
      aspectRatio: this.viewConfig.aspectRatio,
      autoCrop: true,
      dragMode: DragMode.Move,
      cropBoxMovable: false,
      cropBoxResizable: false
    };

    this.cropper = new Cropper(cropBox, options);
  }
  public onCancel() {
    this.error = '';
    this.isShow = false;
    this.applying = false;
    this.inputImage.nativeElement.value = '';
  }

  public onApply() {
    this.applying = true;
    const image64 = this.cropper.getCroppedCanvas().toDataURL(this.fileType);
    const blob = this.dataURItoBlob(image64);

    if (blob.size > this.viewConfig.maxsize) {
      const currentSize = Math.ceil(blob.size / 1024);
      // sent message max then size.
      this.returnData.emit(
        JSON.stringify({
          code: 4000,
          data: currentSize,
          msg: `Max size allowed is ${this.viewConfig.maxsize / 1024}kb, current size is ${currentSize}kb`
        })
      );
      this.error =
        this.viewConfig.errorMsgs['4000'] || `Max size allowed is ${this.viewConfig.maxsize / 1024}kb, Current size is ${currentSize}kb`;
      this.applying = false;
      return;
    } else {
      this.returnData.emit(JSON.stringify({
        code: 2000,
        image: image64,
        filename: this.fileName,
        msg: 'The image was sent to the server successfully'
      }));
      this.onCancel();
      return;
    }
  }

  private dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], {
      type: mimeString
    });
    return bb;
  }

}
