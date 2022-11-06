import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgOption } from '@ng-select/ng-select';
import { Gallery, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ProjectS3GalleryItem, ProjectS3ImageItem } from 'src/app/shared/models/s3-items-model';
import { SafeUrlService } from 'src/app/shared/safe-url.service';
import { TagMultiSelectHelperService } from 'src/app/shared/tag-multi-select-helper.service';
import { common_error_message, s3_image } from 'src/app/shared/toast-message-text';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import { EditTagsFormModel } from '../../edit-tags.form-model';
import { ProjectService } from '../../project.service';
import { Tag } from '../../tag/tag.model';
import { VersionComponent } from '../../version/version.component';
import { VersionUpdateForm } from '../../version/version.model';

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
  items: ProjectS3ImageItem[] = [];
  filteredItems: ProjectS3ImageItem[] = [];
  @ViewChild(VersionComponent)
  versionComponent!: VersionComponent;
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
  activeCallsCount: number = 0;
  versionUpdateForm: VersionUpdateForm = new VersionUpdateForm();
  isVisible: number = 0; //show/hide filters

  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private appSessionStorageService: AppSessionStorageService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private _tagHelperService: TagMultiSelectHelperService,
    private _safeUrlService: SafeUrlService) {
    if (this.appSessionStorageService.getCurrentUser() != null) {
      this.currentUser = JSON.parse(this.appSessionStorageService.getCurrentUser()) as AppUser;
    }
  }
  async prepareImages(): Promise<void> {
    this.activeCallsCount++;
    this.items = await this.projectService.GetDocuments(this.projectId, this.documentType).toPromise()
    this.activeCallsCount--;
    this.filterAndPrepareSlideData();
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.prepareImages(),
      this.prepareTagOptions()
    ])
  }
  async prepareTagOptions(): Promise<void> {
    let tagOptions = await this._tagHelperService.getAllTagOptions();
    this.tagOptions = this.tagOptions.concat(tagOptions);
    this.selectedTags = Object.assign([], this.tagOptions);
    this.editTagsForm.tagOptions = Object.assign([], tagOptions);
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

  async filterAndPrepareSlideData(): Promise<void> {
    if(!this.items?.length)
      return;
    this.filteredItems = [];
    for (let item of this.items) {
      if(!this.showItem(item))
        continue;
      let url: string = this._safeUrlService.getAsString(item.safeUrl);
      if(!url) {
        this.activeCallsCount++;
        url = await this.projectService.getS3ObjectUrl(item.s3Key).toPromise();
        this.activeCallsCount--;
      }
      let imageItem: ProjectS3ImageItem = new ProjectS3ImageItem(this.sanitizer, url)
      if(this.filteredItems)
        this.filteredItems.push(Object.assign(imageItem, item))
      else
        this.filteredItems = [item];
    }

    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Bottom
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.filteredItems);
  }

  openImage(index: number): void {
    this.lightbox.open(index, 'lightbox', { panelClass: 'fullscreen' });
  }

  async ImageUploadSuccess(imageUploads: ProjectS3ImageItem[]): Promise<void> {
    this.items = this.items.concat(imageUploads);
    await this.UpdateProjectResource();
    await this.prepareImages();
  }

  async UpdateProjectResource(): Promise<void> {
    try{
      this.activeCallsCount++;
      var files: any[] = Object.assign([], this.items);
      files.map(file => {
        file.tags = this._tagHelperService.ngOptionsToTagModels(file.tags)
      })
      await this.projectService.UpdateProjectResource(this.projectId, files, this.documentType).toPromise()
    }
    catch(err){
      this.toastr.error(common_error_message);
      throw err;// abort other operations
    }
    finally{
      this.activeCallsCount--;
    }
  }

  async DeleteAll(): Promise<void> {
    if(!this.filteredItems.some(x => x.isChecked)){
      this.toastr.error(s3_image.image_select_count_error);
      return;
    }
    let copy: ProjectS3ImageItem[] = [];
    for(let item of this.items){
      let filteredItem = this.filteredItems.find(x => x.id === item.id || x.s3Key === item.s3Key);
      if(!filteredItem?.isChecked)
        copy.push(item)
      else if(!this.versionComponent.selectedVersion?.id || item.versions.length === 1) 
        continue;
      else {
        item.versions = item.versions.filter(x => x.id !== this.versionComponent.selectedVersion.id)
        copy.push(item)
      }
    }
    this.items = copy;
    await this.UpdateProjectResource();
    this.filterAndPrepareSlideData();
    this.setAllSelected(false);
    this.isMultiSelect = false;
  }

  onMultiSelect(): void {
    this.setAllSelected(false);
    this.isMultiSelect = !this.isMultiSelect;
  }

  setAllSelected(value: boolean): void {
    if(value)
      this.isMultiSelect = true;
    this.filteredItems.map(x => x.isChecked = value);
  }

  close(): void {
    $('#uploadMultiImage').modal('toggle');
  }
  openEditTags(template: TemplateRef<any>, item: ProjectS3GalleryItem): void {
    this.editTagsForm.s3Key = item.s3Key;
    this.editTagsForm.tags = this._tagHelperService.tagModelsToNgOptions(item.tags);
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }
  hideModal(): void {
    this.modalRef.hide();
  }
  async saveTags(): Promise<void> {
    try{
      this.activeCallsCount++
      var tagList: Tag[] = this._tagHelperService.ngOptionsToTagModels(this.editTagsForm.tags);
      await this.projectService.updateDocumentTags(this.editTagsForm.s3Key, tagList).toPromise()
      this.modalRef.hide();
      this.toastr.success('Tags updated');
      var index: number = this.items.findIndex(x => x.id = this.editTagsForm.s3Key);
      this.items[index].tags = tagList;
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.activeCallsCount--
    }
  }
  filterClass(item: ProjectS3GalleryItem): string{
    return this.showItem(item) ? '' : 'hidden'
  }
  showItem(filteredItem: ProjectS3GalleryItem): boolean {
    let tagFilter = false;
    if(!filteredItem.tags.length)
      tagFilter = (!this.selectedTags?.length || this.selectedTags.some(x => x.value === this.untaggedValue));
    else
      tagFilter = this.selectedTags.some(x => filteredItem.tags.map(y => y.id).includes(x.value as string));
    let versionFilter = false;
    if(!filteredItem.versions?.length)
      versionFilter = !this.versionComponent?.selectedVersion?.id
    else
      versionFilter = filteredItem.versions.some(x => x.id === this.versionComponent?.selectedVersion.id)
    return tagFilter && versionFilter;
  }
  async downloadAll(): Promise<void>{
    let checkedItems = this.filteredItems.filter(x => x.isChecked)
    if(!checkedItems.length)
      this.toastr.error('Please select one or more images');
    await Promise.all(checkedItems.map(x =>  this.download(x)));
  }
  async download(item: ProjectS3GalleryItem){
    let buffer = await this.projectService.getS3ObjectBlob(item.s3Key).toPromise();
    let url = window.URL.createObjectURL(buffer);
    const a: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none')
    a.href = url;
    a.download = item.fileName ? item.fileName : item.s3Key;
    a.click();
    a.remove();
  }
  public get selectedVersion() { // to abstract access to view child
    return this.versionComponent?.selectedVersion;
  }
  public get otherVersions() {
    return this.versionComponent?.versions.filter(x => x.id !== this.selectedVersion?.id)
  }
  openVersionModal(template: TemplateRef<any>){
    if(!this.filteredItems.some(x => x.isChecked)){
      this.toastr.error(s3_image.image_select_count_error);
      return;
    }
    this.versionUpdateForm = new VersionUpdateForm();
    this.modalRef = this.modalService.show(template);
  }
  async updateVersionSubmit(): Promise<void> {
    if(!this.versionUpdateForm.targetVersionId) {
      if(this.versionUpdateForm.action === 'move' && this.items.some(x => x.isChecked && x.versions && x.versions.length > 1)) {
        this.versionUpdateForm.errorMsg = 'One or more items have more than one version. Only items with one version can be moved to unversioned';
        return;
      }
      else if(this.versionUpdateForm.action === 'copy') {
        this.versionUpdateForm.errorMsg = 'Cannot copy to unversioned';
        return;
      }
    }
    for(let item of this.items){
      let filteredItem = this.filteredItems.find(x => x.id === item.id || x.s3Key === item.s3Key);
      if(!filteredItem?.isChecked)
        continue;
      let targetVersion = Object.assign({}, this.versionComponent.versions.find(x => x.id === this.versionUpdateForm.targetVersionId));
      switch(this.versionUpdateForm.action){
        case 'move':
          if(!item.versions?.length)
            item.versions = []
          else 
            item.versions = item.versions.filter(x => x.id !== this.versionComponent.selectedVersion.id)
          // intentional fall through
        case 'copy':
          if(!item.versions.some(x => x.id === targetVersion.id))
            item.versions.push(targetVersion)
          break;
        default: this.toastr.error(common_error_message)
          return;
      }
    }
    this.modalRef.hide();
    await this.UpdateProjectResource();
    this.setAllSelected(false);
    this.isMultiSelect = false;
    this.filterAndPrepareSlideData();
  }
  versionError(ev: Error | string){
    if(typeof ev === 'string')
      this.toastr.error(ev)
    else
      this.toastr.error(common_error_message)
  }
  async versionDeleted(id: string): Promise<void> {
    let copy: ProjectS3ImageItem[] = [];
    for(let item of this.items){
      if(!item.versions?.length)
        copy.push(item)
      else if(item.versions.length === 1 && item.versions[0].id === id) 
        continue;
      else {
        item.versions = item.versions.filter(x => x.id !== id)
        copy.push(item)
      }
    }
    this.items = copy;
    await this.UpdateProjectResource();
    this.filterAndPrepareSlideData();
  }
  loadStateChange(isLoading: boolean): void {
    if(isLoading)
      this.activeCallsCount++;
    else
      this.activeCallsCount--;
  }
}