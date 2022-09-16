import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ProjectS3ImageItem } from '../../models/s3-items-model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgOption } from '@ng-select/ng-select';
import { ProjectService } from 'src/app/view/projects/project.service';
import { Version } from 'src/app/view/projects/version/version.model';

declare var $: any;
@Component({
  selector: 'app-s3-multi-image-upload',
  templateUrl: './multi-image-upload.component.html',
  styleUrls: [
    './multi-image-upload.component.scss',
    '../../../../assets/css/app.css'
  ]
})
export class MultiImageUploadComponent implements OnInit {
  @ViewChild('myS3MultiImageInput') myS3MultiImageInput: ElementRef;
  @Input() untaggedValue: string = '';
  @Input() tagOptions: NgOption[] = [{
    label: 'Untagged',
    value: this.untaggedValue
  }]
  @Input()
  selectedVersion!: Version;
  @Output() ImageUploadSuccessEvent = new EventEmitter<ProjectS3ImageItem[]>();

  imageFiles: ProjectS3ImageItem[];
  imageList: any;
  isSaving = 0;
  fileUploads: ProjectS3ImageItem[];
  hasSucces = false;
  
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private projectService: ProjectService,
    private sanitizer: DomSanitizer) {
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
    if (this.imageList != null && this.imageList.length > 0) {
      for (let img of this.imageList) {
        const imgFile = new ProjectS3ImageItem(this.sanitizer, '');
        imgFile.file = img;
        this.imageFiles.push(imgFile);
      }
    }
  }

  onChangeImage($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.imageList = files;
      this.prepareView();
    }
  }

  async upload(): Promise<void> {
    await Promise.all(this.imageFiles.map(x => this.uploadImages(x)))
  }

  public async uploadImages(imgFile: ProjectS3ImageItem) {
    try{
      this.isSaving++;
      imgFile.status = 'uploading';
      let formData = new FormData();
      formData.append('fileData', imgFile.file);
      let {s3Key, safeUrl} = await this.projectService.uploadToS3(formData).toPromise()
      imgFile.data.src = imgFile.data.thumb = safeUrl as string;
      imgFile.s3Key = s3Key;
      imgFile.fileName = imgFile.file.name;
      imgFile.versions = this.selectedVersion ? [this.selectedVersion] : [];
      this.fileUploads.push(imgFile)
      imgFile.status = 'success';
      this.hasSucces = true;
      this.myS3MultiImageInput
    }
    catch{
      imgFile.status = 'error';
    }
    finally{
      this.isSaving--;
    }
  }
  replicateTags(img: ProjectS3ImageItem){
    this.imageFiles.map(x => x.tags = img.tags);
  }
}