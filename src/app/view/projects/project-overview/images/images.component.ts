import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { ToastrService } from 'ngx-toastr';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import { common_error_message, s3_image } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import {  ImageFileUpload } from '../../../properties/properties.model';
import { ProjectService } from '../../project.service';

declare var $: any;
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, OnChanges {

  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  @Input() module:any;
  imageList = [];
  items: GalleryItem[];
  isMultiSelect = false;
  currentUser: AppUser;
  isHide: boolean = true;
  typeOptions: NgOption[] = [
    { value: 0, label: 'Unmarked' },
    { value: 1, label: 'Internal' },
    { value: 2, label: 'External' }
  ]
  selectedTypes = this.typeOptions;
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private s3BucketService: S3BucketService,
    private appSessionStorageService: AppSessionStorageService,) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }
  async prepareImages() {
    var images = await this.projectService.GetDocuments(this.projectId, this.documentType).toPromise()
    if (images && images.length)
      this.imageList = images;
    this.prepareSlideData();
  }

  ngOnInit(): void {
    this.prepareImages(); // Non blocking call
  }
  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    if (this.currentUser.Role == "Client" && (changes.documentType.currentValue == "PrerenderedPhotos" ||
      changes.documentType.currentValue == "RenderedPhotos" ||
      changes.documentType.currentValue == "VideosOrAnimations" ||
      changes.documentType.currentValue == "3DModelViewer" ||
      changes.documentType.currentValue == "ARModelViewer")) {
      this.isHide = false;
    }
    else if (this.currentUser.Role == "Designer" && (changes.documentType.currentValue == "HandSketchesAndDrawings" ||
      changes.documentType.currentValue == "CADDrawings" ||
      changes.documentType.currentValue == "OtherReferences"
    )) {
      this.isHide = false;
    }
  }

  async prepareSlideData() {
    const urls = [];
    for (let img of this.imageList) {
      urls.push(await this.s3BucketService.GetUrl(img.s3FileName));
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

  ImageUploadSuccess(imageUploads: ImageFileUpload[]) {
    for (let imageUpload of imageUploads) {
      this.AddImageFile(imageUpload);
    }
  }

  AddImageFile(imageUpload: ImageFileUpload) {
    this.projectService.AddFile(imageUpload).subscribe(async (data: any) => {
      imageUpload.imageType = 0;
      this.imageList.push(imageUpload);
      await this.UpdateProjectResource();
      const url = await this.s3BucketService.GetUrl(imageUpload.fileKey);
      this.items.push(new ImageItem({ src: url, thumb: url }))
    })
  }

  async UpdateProjectResource(): Promise<void> {
    try{
      var payload = this.imageList.map(x => {
        return {
          s3FileName: x.s3FileName,
          fileName: x.fileName,
          imageType: x.imageType ? x.imageType : 0
        }
      })
      await this.projectService.UpdateProjectResource(this.projectId, payload, this.documentType).toPromise()
    }
    catch(err){
      this.toastr.error(common_error_message);
      throw err;// abort other operations
    }
  }

  DeleteFile(url: string) {
    let fileId: string;
    try {

      fileId = url.split('.amazonaws.com/')[1].split('?')[0];

      this.projectService.DeleteFile(fileId).subscribe((data: any) => {
        this.toastr.info(s3_image.image_delete_success);
        const index = this.imageList.findIndex(imgKey => imgKey === fileId);
        if (index > -1) {
          this.imageList.splice(index, 1);
          setTimeout(() => {
            this.UpdateProjectResource();
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
      this.imageList = this.imageList.filter(x => !selectedImageSrcs.some(y => y.includes(x.s3FileName)))
      this.UpdateProjectResource();
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
  async setImageType(type: number):Promise<void>{
    let itemsSelected: boolean = false;
    for (let item of this.items) {
      const i = this.items.indexOf(item);
      if (i > -1) {
        const galleryImage = document.getElementById('imageCheckbox_' + i) as HTMLInputElement;
        if (galleryImage && galleryImage.checked) {
          itemsSelected = true;
          let imageListIndex: number = this.imageList.findIndex(x => item.data.src.includes(x.s3FileName));
          this.imageList[imageListIndex].imageType = type;
        }
      }
    }
    if(!itemsSelected)
      this.toastr.error(s3_image.image_select_count_error);
    else
      this.UpdateProjectResource();
  }
  getLabel(i: number):string{
    return this.typeOptions.filter(x => x.value === this.imageList[i].imageType)[0]?.label
  }
  getFilter(i: number):boolean{
    return this.selectedTypes.map(x => x.value).includes(this.imageList[i].imageType)
  }
}
