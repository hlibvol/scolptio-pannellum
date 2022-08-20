import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfigsLoaderService } from '../../../services/configs-loader.service';
import { ProjectS3VideoItem } from '../../models/s3-items-model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgOption } from '@ng-select/ng-select';
import { ProjectService } from 'src/app/view/projects/project.service';

declare var $: any;
@Component({
  selector: 'app-s3-multi-video-upload',
  templateUrl: './s3-multi-video-upload.component.html',
  styleUrls: ['./s3-multi-video-upload.component.scss']
})
export class S3MultiVideoUploadComponent implements OnInit {
  @ViewChild('myS3MultiVideoInput') myS3MultiVideoInput: ElementRef;
  @Input() untaggedValue: string = '';
  @Input() tagOptions: NgOption[] = [{
    label: 'Untagged',
    value: this.untaggedValue
  }]

  @Output() UploadSuccessEvent = new EventEmitter<ProjectS3VideoItem[]>();
  @Output() closeModalEvent = new EventEmitter<void>();

  videoFiles: ProjectS3VideoItem[];
  videoFilesRaw: any;
  isSaving = 0;
  uploadedVideoFiles: ProjectS3VideoItem[];
  hasSuccess = false;
  
  protected _configLoaderService: ConfigsLoaderService;

  constructor(private projectService: ProjectService,
    private sanitizer: DomSanitizer) {
    this.videoFiles = new Array();
    this.uploadedVideoFiles = new Array();
  }

  ngOnInit(): void { }

  close() {
    if (this.uploadedVideoFiles && this.uploadedVideoFiles.length > 0) {
      this.UploadSuccessEvent.emit(this.uploadedVideoFiles);
    }
    this.clearFiles();
    this.closeModalEvent.emit();
  }

  clearFiles() {
    this.myS3MultiVideoInput.nativeElement.value = "";
    this.videoFiles = [];
    this.uploadedVideoFiles = new Array();
    this.hasSuccess = false;
    this.isSaving = 0;
  }

  prepareView() {
    if (this.videoFilesRaw != null && this.videoFilesRaw.length > 0) {
      for (let img of this.videoFilesRaw) {
        const videoFile = new ProjectS3VideoItem(this.sanitizer, '');
        videoFile.file = img;
        this.videoFiles.push(videoFile);
      }
    }
  }

  onChangeFile($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    if (files && files.length > 0) {
      this.videoFilesRaw = files;
      this.prepareView();
    }
  }

  async upload(): Promise<void> {
    await Promise.all(this.videoFiles.map(x => this.uploadFiles(x)))
  }

  public async uploadFiles(videoFile: ProjectS3VideoItem) {
    try{
      this.isSaving++;
      videoFile.status = 'uploading';
      const formData = new FormData();
      formData.append('fileData', videoFile.file);
      const {s3Key, safeUrl} = await this.projectService.uploadToS3(formData).toPromise()
      videoFile.safeUrl = safeUrl;
      videoFile.s3Key = s3Key;
      videoFile.fileName = videoFile.file.name;
      this.uploadedVideoFiles.push(videoFile)
      videoFile.status = 'success';
      this.hasSuccess = true;
    }
    catch{
      videoFile.status = 'error';
    }
    finally{
      this.isSaving--;
    }
  }

}