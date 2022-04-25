import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../../project.service';
import { Tag } from '../tag.model';

declare var $: any;
@Component({
  selector: 'app-tag-add',
  templateUrl: './tag-add.component.html',
  styleUrls: ['./tag-add.component.scss',
  '../../../../../assets/css/app.css',
  '../../../../../assets/css/icons.css']
})
export class TagAddComponent {
  isSaving: boolean = false;
  tag: Tag = new Tag();
  @Output()
  addSuccessEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor(private projectService: ProjectService, private toastr: ToastrService) { }

  async addTagSubmit(): Promise<void> {
    this.tag.id = ''; // Clear Id if previously added
    if(!this.tag.name){
      this.toastr.error('Please enter name');
      return;
    }
    this.isSaving = true;
    try{
      await this.projectService.addTag(this.tag).toPromise();
      this.addSuccessEvent.emit();
      $('#addTag').modal('toggle');
      this.toastr.success('Saved successfully');
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 409)
        this.toastr.error('Tag with this name already exists');
      else
        this.toastr.error(common_error_message);
    }
    finally{
      this.isSaving = false;
    }
  }
}
