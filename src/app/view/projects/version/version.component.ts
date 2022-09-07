import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { VersionService } from 'src/app/services/version.service';
import { Version, VersionForm } from './version.model';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss', 
  '../../../../assets/css/app.css',
  '../../../../assets/css/icons.css']
})
export class VersionComponent implements OnInit {

  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Output()
  versionsUpdated: EventEmitter<void> = new EventEmitter();
  @Output()
  loadStateChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  error: EventEmitter<Error> = new EventEmitter()
  versions: Version[] = [];
  selectedVersion: Version = new Version;
  versionForm: VersionForm = new VersionForm;
  modalRef: BsModalRef = new BsModalRef();

  constructor(private versionService: VersionService, private bsModalService: BsModalService) { }

  async ngOnInit(): Promise<void> {
    if(!this.versions?.length)
      await this.loadVersions();
  }
  async loadVersions(): Promise<void>{
    this.loadStateChange.emit(true)
    try{
      this.versions = await this.versionService.getVersions(this.projectId, this.documentType).toPromise();
      this.versionsUpdated.emit();
      this.selectedVersion = Object.assign({}, this.versions[2]);
    }
    catch(err){
      this.error.emit(err);
    }
    finally{
      this.loadStateChange.emit(false)
    }
  }
  showModal(template: TemplateRef<any>, targetId: string = '') {
    this.versionForm = new VersionForm();
    this.versionForm.header = 'Add new version';
    if(targetId) {
      const version = this.versions.find(x => x.id === targetId)
      this.versionForm = Object.assign(this.versionForm, version);
      this.versionForm.header = 'Rename version';
    }
    this.modalRef = this.bsModalService.show(template, {
      class: 'modal-sm'
    })
  }
  async versionModalSubmit(): Promise<void> {
    this.loadStateChange.emit(true)
    try{
      if(!this.versionForm.id){
        this.selectedVersion = await this.versionService.create(this.projectId, this.documentType, this.versionForm.versionName).toPromise();
        this.versions.push(this.selectedVersion)
      }
      else{
        await this.versionService.update(this.versionForm).toPromise();
        this.versions.find(v => v.id === this.versionForm.id).versionName = this.versionForm.versionName
        this.selectedVersion.versionName = this.versionForm.versionName;
      }
      this.versionsUpdated.emit();
      this.modalRef.hide();
    }
    catch(err){
      this.error.emit(err);
    }
    finally{
      this.loadStateChange.emit(false);
    }
  }
  async delete(){
    this.loadStateChange.emit(true)
    try{
      await this.versionService.delete(this.versionForm.id).toPromise();
      this.versions = this.versions.filter(x => x.id !== this.versionForm.id);
      this.versionsUpdated.emit();
    }
    catch(err){
      this.error.emit(err);
    }
    finally{
      this.loadStateChange.emit(false);
    }
  }
}
