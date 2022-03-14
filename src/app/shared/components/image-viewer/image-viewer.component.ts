import { Component, Injector, Input, OnInit } from '@angular/core';
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ToastrService } from 'ngx-toastr';
import { S3BucketService } from '../../s3-bucket.service';

@Component({
  selector: 'app-s3-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  @Input() imageKey = '';
  @Input() imageHeight = 200;
  @Input() imageWidth = 400;

  imgUrl: string;
  isSaving = true;
  protected _configLoaderService: ConfigsLoaderService;

  constructor(_injector: Injector,
    private toastr: ToastrService,
    private s3BucketService: S3BucketService) {
    this._configLoaderService = _injector.get(ConfigsLoaderService);
  }

  ngOnInit(): void {
    this.getImage();
  }



  private async getImage() {

    if (this.imageKey) {
      this.isSaving = true;
      this.imgUrl = await this.s3BucketService.GetUrl(this.imageKey);
      if (!this.imgUrl) {
        this.toastr.error('Something went wrong. Could not get image.');
      }
      this.isSaving = false;
    }
  }

}
