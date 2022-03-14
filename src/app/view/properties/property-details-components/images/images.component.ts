import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { ToastrService } from 'ngx-toastr';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import { common_error_message, s3_image } from 'src/app/shared/toast-message-text';
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import { FileUpload, Properties } from '../../properties.model';
import { PropertiesService } from '../../properties.service';

declare var $: any;
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  imageList = [];
  property: Properties;
  items: GalleryItem[];
  isMultiSelect = false;

  constructor(private propertiesService: PropertiesService,
    private toastr: ToastrService,
    public gallery: Gallery, 
    public lightbox: Lightbox,
    private s3BucketService: S3BucketService) {
      this.propertiesService.propertyOnParent.subscribe((property) => {
        this.property = property
        this.prepareImages();
      })
    }
  prepareImages() {
    if(this.property && this.property.images){
      this.imageList = this.property.images;
      this.prepareSlideData();
    }
  }

  ngOnInit(): void {
    if(!this.property)
      this.property = history.state.data;
      this.prepareImages();
  }

  async prepareSlideData() {
    const urls = [];
    for (let img of this.imageList) {
      urls.push(await this.s3BucketService.GetUrl(img));
    }
    this.items = urls.map(url => new ImageItem({ src: url, thumb: url }));

    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Bottom
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }

  openImage(index: number) {
    this.lightbox.open(index, 'lightbox', { panelClass: 'fullscreen' });
  }

  ImageUploadSuccess(imageUploads: FileUpload[]) {
    for (let imageUpload of imageUploads) {
      this.AddImageFile(imageUpload);
    }
  }

  AddImageFile(imageUpload: FileUpload) {
    this.propertiesService.AddFile(imageUpload).subscribe(async (data: any) => {
      this.imageList.push(imageUpload.fileKey);
      this.UpdatePropertiesResource();
      const url = await this.s3BucketService.GetUrl(imageUpload.fileKey);
      this.items.push(new ImageItem({ src: url, thumb: url }))
    }, (error) => {

    })
  }

  UpdatePropertiesResource() {
    this.propertiesService.UpdatePropertiesResource(this.property.id, this.imageList, 'images').subscribe((data: any) => {
      this.property.images = this.imageList;
      this.propertiesService.updatePropertyOnParent(this.property)
      this.propertiesService.reloadTimeline();
    }, (error) => {
      this.toastr.error(common_error_message);
    })
  }

  DeleteFile(url: string) {
    let fileId: string;
    try {

      fileId = url.split('.amazonaws.com/')[1].split('?')[0];

      this.propertiesService.DeleteFile(fileId).subscribe((data: any) => {
        this.toastr.info(s3_image.image_delete_success);
        const index = this.imageList.findIndex(imgKey => imgKey === fileId);
        if (index > -1) {
          this.imageList.splice(index, 1);
          setTimeout(() => {
            this.UpdatePropertiesResource();
          }, 1000);
        }
      }, (error) => {
        this.toastr.error(s3_image.image_delete_error);
      })
    } catch {

    }
  }

  DeleteAll() {
    let selectedImageSrcs = new Array();
    for (let item of this.items) {
      const i = this.items.indexOf(item);
      if (i > -1) {
        const galleryImage = document.getElementById('imageCheckbox_' + i) as HTMLInputElement;
        if (galleryImage && galleryImage.checked) {
          selectedImageSrcs.push(item.data.src);
          this.DeleteFile(item.data.src);
        }
      }
    }
    if (selectedImageSrcs && selectedImageSrcs.length > 0) {
      for (let itemSrc of selectedImageSrcs) {
        const i = this.items.findIndex(item => item.data.src === itemSrc);
        if (i > -1) {
          this.items.splice(i, 1);
        }
      }
    } else {
      this.toastr.error(s3_image.image_select_count_error);
    }
  }

  onMultiSelect() {
    for (let i = 0; i < this.items.length; i++) {
      const galleryImage = document.getElementById('imageCheckbox_' + i) as HTMLInputElement;
      galleryImage.checked = false;
    }
    this.isMultiSelect = !this.isMultiSelect;
  }

  close() {
    $('#uploadMultiImage').modal('toggle');
  }

}
