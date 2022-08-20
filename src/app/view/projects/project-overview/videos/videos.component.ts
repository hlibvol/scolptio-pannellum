import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectS3VideoItem } from 'src/app/shared/models/s3-items-model';
import { TagMultiSelectHelperService } from 'src/app/shared/tag-multi-select-helper.service';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { EditTagsFormModel } from '../../edit-tags.form-model';
import { ProjectService } from '../../project.service';
import { Tag } from '../../tag/tag.model';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  @Input() module:any;
  isLoading: boolean = false;
  videos: ProjectS3VideoItem[] = [];
  readonly untaggedValue: string = '~UNTAGGED~';
  tagOptions: NgOption[] = [{
    label: 'Untagged',
    value: this.untaggedValue
  }]
  selectedTags = this.tagOptions;
  editTagsForm: EditTagsFormModel = new EditTagsFormModel();
  modalRef: BsModalRef = new BsModalRef();
  isVisible: number = 0;
  deleteId: string = '';
  constructor(private _projectService: ProjectService,
    private _toastr: ToastrService,
    private _modalService: BsModalService,
    private _tagHelperService: TagMultiSelectHelperService) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.prepareTagOptions(),
      this.loadVideos()
    ]) 
  }
  async UploadSuccess(uploads: ProjectS3VideoItem[]): Promise<void> {
    try{
      this.closeModal()
      var files: any[] = Object.assign([], uploads);
      files.map(file => {
        file.tags =  file.tags.map((tag: NgOption) => {
          return {
            id: tag.value,
            name: tag.label
          }
        })
      })
      await this._projectService.createDocuments(this.projectId, files, this.documentType).toPromise();
      this._toastr.success('Saved successfully')
      await this.loadVideos();
    }
    catch{
      this._toastr.error(common_error_message)
    }
    finally{
      this.isLoading = false;
    }
  }
  async loadVideos(): Promise<void>{
    this.isLoading = true;
    this.videos = await this._projectService.GetDocuments(this.projectId, this.documentType).toPromise()
    this.videos = await Promise.all(this.videos.map(x => this.fillUrl(x)));
    this.isLoading = false;
  }
  async fillUrl(item: ProjectS3VideoItem): Promise<ProjectS3VideoItem>{
    item.safeUrl = await this._projectService.getS3ObjectUrl(item.s3Key).toPromise();
    return item;
  }
  openModal(modal: TemplateRef<any>): void {
    this.modalRef = this._modalService.show(modal)
  }
  closeModal(): void {
    this.modalRef.hide();
  }
  async prepareTagOptions(): Promise<void> {
    let tagOptions = await this._tagHelperService.getAllTagOptions();
    this.tagOptions = this.tagOptions.concat(tagOptions);
    this.selectedTags = Object.assign([], this.tagOptions);
    this.editTagsForm.tagOptions = Object.assign([], tagOptions);
  }
  
  showItem(tags: Tag[]): boolean {
    return this.selectedTags?.some(x => tags.some(y => y.id === x.value));
  }
  openEditTags(item: ProjectS3VideoItem, modal: TemplateRef<any>): void {
    this.editTagsForm.s3Key = item.s3Key;
    this.editTagsForm.tags = this._tagHelperService.tagModelsToNgOptions(item.tags);
    this.openModal(modal)
  }
  async saveTags(): Promise<void>{
    try{
      var tagList: Tag[] = this._tagHelperService.ngOptionsToTagModels(this.editTagsForm.tags);
      await this._projectService.updateDocumentTags(this.editTagsForm.s3Key, tagList).toPromise();
      this.closeModal()
      this._toastr.success('Tags updated');
      await this.loadVideos();
    }
    catch{
      this._toastr.error(common_error_message);
    }
  }
  openDeleteConfirmation(s3Key: string, modal: TemplateRef<any>): void {
    this.deleteId = s3Key;
    this.openModal(modal);
  }
  async delete(): Promise<void> {
    try{
      await this._projectService.DeleteDocument(this.deleteId).toPromise();
      this._toastr.success('Video deleted')
      this.closeModal()
      await this.loadVideos();
    }
    catch{
      this._toastr.error(common_error_message);
    }
  }
}