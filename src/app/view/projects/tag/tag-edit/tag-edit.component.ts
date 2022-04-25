import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { common_error_message } from 'src/app/shared/toast-message-text';
import { ProjectService } from '../../project.service';
import { Tag } from '../tag.model';

declare var $: any;
@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss',
  '../../../../../assets/css/app.css',
  '../../../../../assets/css/icons.css']
})
export class TagEditComponent {

  isSaving: boolean = false;
  @Input()
  tag: Tag = new Tag();
  @Output()
  updateSuccessEvent: EventEmitter<void>  = new EventEmitter();
  constructor(private projectService: ProjectService, private toastrService: ToastrService) { }
  async editTagSubmit(): Promise<void>{
    this.isSaving = true;
    try{
      await this.projectService.editTag(this.tag).toPromise();
      $('#editTag').modal('toggle');
      this.toastrService.success('Saved succesfully');
      this.updateSuccessEvent.emit();
    }
    catch{
      this.toastrService.success(common_error_message);
    }
    finally{
      this.isSaving = false;
    }
  }

}
