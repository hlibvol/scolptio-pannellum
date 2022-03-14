import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentTemplateService } from 'src/app/services/document-template-service';
import { ToastrService } from 'ngx-toastr';
import { common_error_message, doc_template } from 'src/app/shared/toast-message-text';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/shared/settings.service';
import { SelectionChange } from 'ngx-quill';

@Component({
  selector: 'app-document-templates-list',
  templateUrl: './document-templates-list.component.html',
  styleUrls: [
    './document-templates-list.component.scss',
    '../../../../assets/css/app.css',
  ],
})
export class DocumentTemplatesListComponent implements OnInit {
  public Editor = ClassicEditor;
  editorForm: FormGroup;
  creatorForm: FormGroup
  storData: any = [];
  finalstorData: any = [];
  public content;
  dataOfTable: any = [];
  templateType = '';
  templateName = '';
  templateId = '';
  pageNumber = 1;
  pageSize = 10;
  total = 0;
  searchKey: '';
  searchType = '';
  visibleFilter = false;
  filterObj: any;
  isLoading = false;
  modalRef: BsModalRef<any>;
  placeholders: string[] = [];
  quillInstances: {create: any, edit: any};
  constructor(
    private _documentTemplateService: DocumentTemplateService,
    private _toastr: ToastrService,
    private _modalService: BsModalService,
    private _settingsService: SettingsService
    ) { }

  async ngOnInit(): Promise<void> {
    this.editorForm = new FormGroup({
      editor: new FormControl(),
      type: new FormControl(),
    });
    this.creatorForm = new FormGroup({
      editor: new FormControl(),
      type: new FormControl(),
    });
    this.getTempleteTotalCount();
    await this.initPlaceholders();
  }
  async initPlaceholders():Promise<void> {
    this.placeholders = (await this._settingsService.getAllPlaceholders().toPromise()).map(x => x.key);
  }
  getAllTemplete() {
    this.isLoading = true;
    this._documentTemplateService.getData(this.pageNumber, this.pageSize, this.searchKey, this.filterObj).subscribe((data) => {
      this.storData = this.finalstorData = data;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }

  getTempleteTotalCount() {
    this.isLoading = true;
    this._documentTemplateService.getTempleteTotalCount().subscribe((data: any) => {
      this.total = data;
      if (this.total > 0) {
        this.getAllTemplete();
      } else {
        this.isLoading = false;
      }
    });
  }

  getTemplate(event: any, key: string) {
    if (event.target.value) {
      this.templateType = event.target.value;
      this._documentTemplateService
        .getTemplate(event.target.value)
        .subscribe((res) => {
          this.content = res;
          if(key === 'edit')
            (this.editorForm.controls.editor as FormControl).setValue(
              this.content.template
            );
          else if(key === 'create')
            (this.creatorForm.controls.editor as FormControl).setValue(
              this.content.template
            );
          else
              throw new Error('key invalid');
        });
    }
  }

  getTemplateWithId(event: any) {
    if (event.target.value) {
      this.templateType = event.target.value;
      this._documentTemplateService
        .getTemplate(event.target.value)
        .subscribe((res) => {
          this.content = res;
          (this.editorForm.controls.editor as FormControl).setValue(
            this.content.template
          );
        });
    }
  }

  async onSubmit(data: any, key: string):Promise<void> {
    try{
      const reqBody = {} as any;
      reqBody['TemplateData'] = data.value?.editor;
      reqBody['TemplateType'] = this.templateType;
      reqBody['TemplateName'] = this.templateName;
      reqBody['CreatedBy'] = 'user name';
      reqBody['Status'] = 'Draft';

      if(key === 'add')
        await this._documentTemplateService.createTemplate(reqBody).toPromise();
      else if(key === 'edit'){
        reqBody['TemplateId'] = this.templateId;
        await this._documentTemplateService.updateTemplate(reqBody).toPromise();
      }
      else
        throw new Error("Invalid key")
      this._toastr.success(doc_template[key])
      this.getAllTemplete()
    }
    catch(err){
      this._toastr.error(common_error_message)
    }
    
  }

  postTemplate() { }

  onPaginationChange(pageNumber: string) {
    const selectedPage = Number(pageNumber);
    if (selectedPage != NaN) {
      this.pageNumber = selectedPage;
      this.getAllTemplete();
    }
  }

  editRecord(recordId: string):void{
    this.templateId = recordId;
    let record:any = this.storData.filter(x => x.id === this.templateId)[0];
    this.templateType = record.templateType;
    this.templateName = record.templateName;
    (this.editorForm.controls.editor as FormControl).setValue(
      record.templateData
    );
  }


  async deleteTemplate(): Promise<void> {
    await this._documentTemplateService.deleteTemplate(this.templateId).toPromise();
    this.getAllTemplete();
    this.modalRef.hide();
    this._toastr.success(doc_template.delete);
  }

  openModal(template: TemplateRef<any>,id : any,templateName: string) 
  {
    this.templateName = templateName;
    this.templateId = id;
    this.modalRef = this._modalService.show(template, { animated: false, class: 'modal-sm' });
  }
  addPlaceholder(key: string, chosenPlaceholder: string = ''){
    const selection = this.quillInstances[key].getSelection(); 
    this.quillInstances[key].insertText(selection.index, chosenPlaceholder, 'user');
  }
  created(instance, key: string){
    if(!this.quillInstances)
      this.quillInstances = {create: undefined, edit: undefined};
    this.quillInstances[key] = instance;
  }

  search(event) {
    if(event.keyCode == 13) {
      this.getAllTemplete();
    }
  }

  onSearchList(searchValue) {
    if (searchValue != '')
      this.storData = this.finalstorData.filter(x => (x.templateName != null && x.templateName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1));
    else
      this.storData = this.finalstorData;
  }

  onChange(val) {
    if (this.searchType == '')
      this.visibleFilter = false;
    else
      this.visibleFilter = true;
  }

  clearFilter() {
    this.searchType = '';
    this.filterObj = [''];
    this.visibleFilter = false;
    this.getAllTemplete();
  }

  actionFilter() {
    this.filterObj = [
      this.searchType,  
    ]
    this.getAllTemplete();
  }
}

function editor(editor: any) {
  throw new Error('Function not implemented.');
}
