import { EventEmitter } from '@angular/core';
import { Component, DoCheck, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ToastrService } from 'ngx-toastr';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';

@Component({
  selector: 'app-listing-image-view',
  templateUrl: './listing-image-view.component.html',
  styleUrls: ['./listing-image-view.component.scss']
})
export class ListingImageViewComponent implements OnInit,DoCheck {


  imageList: any = [];
  @Input()
  set images(image: any) {
    console.log("set images", image);
    this.imageList = [];
    this.imageList = [].concat(image)
    this.getImage();
  }
  get images() {
    return this.imageList;
  }

  @Output() DeleteImage = new EventEmitter<any>();
  @Output() MainImage = new EventEmitter<any>();

  isSaving: boolean = false;
  imageURLs: any = [];
  iterableDiffer: any;
  constructor(private toastr: ToastrService, private iterableDiffers: IterableDiffers , private s3BucketService : S3BucketService) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit(): void {
  }

  // ngOnChanges(change: SimpleChanges){
  //   console.log("simplechange",change);
  // }

  ngDoCheck() {
    let change = this.iterableDiffer.diff(this.images);
    if (change) {
      console.log(this.imageList);
    }
  }



  private async getImage() {

    this.imageURLs=[];
    await this.imageList.forEach(async imageKey => {

      if (imageKey) {
        const client = new S3Client({
          credentials: {
            accessKeyId: "AKIAYRELZPYTB44GTA42",
            secretAccessKey: "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"
          },
          region: "us-east-2"
        });
    
        const params = {
          Bucket: "scolptio-crm-bucket",
          Key: imageKey
        };
        this.isSaving = true;
        let imgUrl = await this.s3BucketService.GetUrl(imageKey.image);
        if (!imgUrl) {
          this.toastr.error('Something went wrong. Could not get image.');
        }
        else {
          this.imageURLs.push({imgUrl,image:imageKey.image,isPrimary:imageKey.isPrimary});
        }
        this.isSaving = false;
      }
    });

  }

  DeleteFile(image,index){
    this.DeleteImage.emit(image);
  }

  MaingImage(image){
    this.MainImage.emit(image);
  }

}
