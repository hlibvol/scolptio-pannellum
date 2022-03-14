import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { reject } from 'q';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import { AppSessionStorageService } from 'src/app/shared/session-storage.service';
import { common_error_message, s3_image } from 'src/app/shared/toast-message-text';
import { AppUser } from '../../auth-register/auth-register.model';
import { FileUpload } from '../../properties/properties.model';
import { PropertiesService } from '../../properties/properties.service';
import { ListingService } from '../listing.service';

@Component({
  selector: 'app-listing-image',
  templateUrl: './listing-image.component.html',
  styleUrls: ['./listing-image.component.scss']
})
export class ListingImageComponent implements OnInit {

  @Input() template: any;
  @Input() listingId:any;
  currentUser:any;
  imageList: Array<any> = [];
  imageNameList : Array<string> = [];
  constructor( private appSessionStorageService: AppSessionStorageService,
    private _propertiesService: PropertiesService,
    private _listingService : ListingService , 
    private _toastr:ToastrService,
    private _s3BucketService : S3BucketService
    ) { 
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }

  ngOnInit(): void {
    this.getListingImages();
  }

  hide() {
    this.template.hide();
  }

  getListingImages(){
    this._listingService.Get(this.listingId).subscribe(res=>{
      if(res.images && res.images.length>0){
        let images:Array<any> = [];
        res.images.forEach(element => {
          images.push({image:element.image,isPrimary : element.isPrimary});
        });
        this.imageList = [].concat(images);          
      }
    })
  }

  ImageUploadSuccess(imageUploads: FileUpload[]) {
    this.AddImageFile(imageUploads).then(res => {
      this.UpdatePropertiesResource();
      //if (imageUploads && imageUploads.length > 1) {
        //this.imageList = [].concat(this.imageNameList);
      //} 
    })
  }

  AddImageFile(imageUploads: FileUpload[]) {
    return new Promise((resolve, reject) => {
      let cnt=0;
      imageUploads.forEach((imageUpload, index, arry) => {
        this._propertiesService.AddFile(imageUpload).subscribe((data: any) => {
          this.imageNameList.push(imageUpload.fileKey);
          debugger;
          cnt++;
          // this.UpdatePropertiesResource();
          if (cnt == arry.length) { resolve(true); }
        }, (error) => {

        }, () => { })
      })
    })
  }

  UpdatePropertiesResource() {
    this._listingService.UpdatePropertiesResource(this.listingId, this.imageNameList, 'images',this.currentUser.OrgId).subscribe((data: any) => {
      this.getListingImages();
    }, (error) => {
      this._toastr.error(common_error_message);
    })
  }

  DeleteImage(image:any){
    this._s3BucketService.deleteObj(image).then(res=>{
      var model = {
        image: image,
        orgId : this.currentUser.OrgId,
        id : this.listingId
      }
      this._listingService.deleteImage(model).subscribe(res=>{
        this._toastr.success(s3_image.image_delete_success);
      },()=>{},()=>{this.getListingImages()})
   })
  }

  MainImage(image:any){
    var model = {
      image: image,
      orgId : this.currentUser.OrgId,
      id : this.listingId
    }
    this._listingService.MainImage(model).subscribe(res=>{
      this._toastr.success(s3_image.image_delete_success);
    },()=>{},()=>{this.getListingImages()})
  }

}
