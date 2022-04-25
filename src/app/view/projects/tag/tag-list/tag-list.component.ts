import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../../project.service';
import { Tag } from '../tag.model';


@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss',
  '../../../../../assets/css/app.css',
  '../../../../../assets/css/icons.css']
})
export class TagListComponent implements OnInit {
  isLoading = false;
  tagList: Tag[];
  finaltagList: Tag[];
  pageNumber = 1;
  pageSize = 15;
  total = 0;
  selectedTag: Tag = new Tag;
  searchKey:string = '';
  modalRef: BsModalRef = new BsModalRef
  constructor(private projectService: ProjectService,
    private toastr: ToastrService,
    private modalService: BsModalService) {
  }

  async ngOnInit(): Promise<void> {
    await this.GetAll();
  }

  async GetAll(): Promise<void> {
    try{
      this.isLoading = true;
      let getAllTagsResponse:any = await this.projectService.getAllTags(this.pageNumber, this.pageSize, this.searchKey).toPromise();
      this.total = getAllTagsResponse.count as number;
      this.tagList = this.finaltagList = getAllTagsResponse.tags as Tag[];
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isLoading = false;
    }
  }
  async onPaginationChange(pageNumber: string): Promise<void> {
    this.pageNumber = parseInt(pageNumber);
    await this.GetAll();
  }

  setSelectedTag(tag: Tag) {
    this.selectedTag = Object.assign({}, tag);
  }

  openDelete(tag: Tag, template: TemplateRef<any>): void {
    this.setSelectedTag(tag);
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  async onSearchList(ev: KeyboardEvent): Promise<void> {
    if(ev.keyCode !== 13)
      return;
    await this.refresh();
  }

  async refresh(): Promise<void>{
    this.pageNumber = 1;
    this.pageSize = 15;
    await this.GetAll();
  }

  async delete(): Promise<void>{
    this.isLoading = true
    try{
      this.modalRef.hide();
      await this.projectService.deleteTag(this.selectedTag.id).toPromise();
      this.toastr.success('Tag deleted');
      await this.refresh();
    }
    catch{
      this.toastr.error(common_error_message);
    }
    finally{
      this.isLoading = false;
    }
  }
}
