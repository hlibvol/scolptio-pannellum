import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, s3_image } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import {  ImageFileUpload } from '../../../properties/properties.model';
import { EditTagsFormModel } from '../../edit-tags.form-model';
import { ProjectService } from '../../project.service';
import { Tag } from '../../tag/tag.model';

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
  readonly untaggedValue: string = '~UNTAGGED~';
  tagOptions: NgOption[] = [{
    label: 'Untagged',
    value: this.untaggedValue
  }]
  selectedTags = this.tagOptions;
  editTagsForm: EditTagsFormModel = new EditTagsFormModel();
  modalRef: BsModalRef = new BsModalRef();
  isLoading: boolean = false;
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private appSessionStorageService: AppSessionStorageService,
    private modalService: BsModalService) {
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

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await Promise.all([
      this.prepareImages(),
      this.prepareTagOptions()
    ])
    this.isLoading = false;
  }
  async prepareTagOptions(): Promise<void> {
    let tagOptions = await this.getAllTags(100);
    this.tagOptions = this.tagOptions.concat(tagOptions);
    this.selectedTags = Object.assign([], this.tagOptions);
    this.editTagsForm.tagOptions = Object.assign([], tagOptions);
  }
  async getAllTags(batchSize: number): Promise<NgOption[]> {
    let options = [];
    let firstBatch = await this.projectService.getAllTags(1, batchSize, '').toPromise();
    if(!firstBatch.tags.length)
      return options;
    else{
      options = options.concat(firstBatch.tags.map((x) => {
        return {
          label: x.name,
          value: x.id
        }
      }))
      let batchCount: number = firstBatch.count / batchSize + 1;
      for(var batchNumber = 2; batchNumber <= batchCount; batchNumber++){
        let page = await this.projectService.getAllTags(batchNumber, batchSize, '').toPromise();
        options = options.concat(page.tags.map((x) => {
          return {
            label: x.name,
            value: x.id
          }
        }))
      }
      return options;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    
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
      urls.push(await this.projectService.getS3ObjectUrl(img.s3FileName).toPromise());
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
      imageUpload.tags = [];
      this.imageList.push(imageUpload);
      await this.UpdateProjectResource();
      const url = await this.projectService.getS3ObjectUrl(imageUpload.fileKey).toPromise();
      this.items.push(new ImageItem({ src: url, thumb: url }))
    })
  }

  async UpdateProjectResource(): Promise<void> {
    try{
      var payload = this.imageList.map(x => {
        return {
          s3FileName: x.s3FileName,
          fileName: x.fileName,
          tags: x.tags
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
  openEditTags(template: TemplateRef<any>, item){
    let imageListItem = this.imageList.find(x => x.s3FileName === item.data.src.split('.amazonaws.com/')[1].split('?')[0])
    this.editTagsForm.documentId = imageListItem.id;
    this.editTagsForm.tags = imageListItem.tags.map((x) => {
      return {
        label: x.name,
        value: x.id
      }
    });
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }
  closeEditTags(){
    this.modalRef.hide();
  }
  async saveTags(): Promise<void> {
    try{
      var tagList: Tag[] = this.editTagsForm.tags.map(x => {
        let tag:Tag = new Tag;
        tag.id = x.value as string;
        tag.name = x.label; // Probably not necessary
        return tag;
      });
      await this.projectService.updateDocumentTags(this.editTagsForm.documentId, tagList).toPromise()
      this.modalRef.hide();
      this.toastr.success('Tags updated');
      var index: number = this.imageList.findIndex(x => x.id = this.editTagsForm.documentId);
      this.imageList[index].tags = tagList;
    }
    catch{
      this.toastr.error(common_error_message);
    }
  }
  filtered(item): boolean{
    let imageListItem = this.imageList.find(x => x.s3FileName === item.data.src.split('.amazonaws.com/')[1].split('?')[0])
    if(!imageListItem.tags.length)
      return this.selectedTags.some(x => x.value === this.untaggedValue);
    return this.selectedTags.some(x => imageListItem.tags.map(y => y.id).includes(x.value));
  }
}
