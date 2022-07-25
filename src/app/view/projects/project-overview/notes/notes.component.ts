import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppUser } from 'src/app/view/auth-register/auth-register.model';
import { ProjectService } from '../../project.service';
import { Notes } from './notes.model';

declare var $: any;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss',
  '../../../../../assets/auth-pages/sass/bootstrap/bootstrap.scss']
})
export class NotesComponent implements OnInit {
  
  @Input()
  projectId: string = '';
  @Input()
  documentType: string = '';
  @Input()
  header: string = '';
  isLoading: boolean = false;
  notesForm: FormGroup = new FormGroup({
    markupContent: new FormControl(),
    id: new FormControl()
  });
  quill: any;
  notesList: Notes[] = [];
  currentUser: AppUser;
  modalRef: BsModalRef = new BsModalRef();
  constructor(private projectService: ProjectService,private modalService: BsModalService, private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    try{
      this.isLoading = true;
      this.notesList = await this.projectService.GetDocuments(this.projectId, this.documentType).toPromise();
    }
    catch{
      this.toastr.error('Something went wrong');
    }
    finally{
      this.isLoading = false;
    }
  }
  editorCreated(instance){
    this.quill = instance;
  }
  async onSubmit(): Promise<void>{
    if(!this.notesForm.value?.markupContent)
      return;
    $('#uploadNotes').modal('toggle');
    this.isLoading = true;
    try{
      let id: string = this.notesForm.get('id').value;
      if(id) {
        let i: number = this.notesList.findIndex(x => x.id === id);
        this.notesList[i] = await this.projectService.updateNotes(this.notesForm.value).toPromise();
      }
      else {
        var notes: Notes = await this.projectService.createNotes(this.notesForm.value?.markupContent, this.projectId, this.documentType).toPromise();
        this.notesList.push(notes);
      }
    }
    catch{
      this.toastr.error('Something went wrong')
    }
    finally{
      this.isLoading = false;
      this.clearForm();
    }
  }
  beginEdit(notes: Notes): void {
    this.notesForm.setValue({
      id: notes.id,
      markupContent: notes.markupContent
    })
    $('#uploadNotes').modal('toggle')
  }
  async delete(): Promise<void> {
    try{
      let id: string = this.notesForm.get('id').value;
      this.isLoading = true;
      await this.projectService.deleteNotes(id).toPromise();
      this.notesList = this.notesList.filter(x => x.id !== id);
    }
    catch{
      this.toastr.error('Something went wrong');
    }
    finally{
      this.isLoading = false;
      this.clearAndCloseDeleteConfirmation();
    }
  }
  openDeleteConfirmation(template: TemplateRef<any>, id: string): void {
    this.notesForm.setValue({
      id,
      markupContent: ''
    })
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }
  clearAndCloseDeleteConfirmation(): void {
    this.clearForm();
    this.modalRef.hide();
  }
  clearForm(): void {
    this.notesForm.setValue({
      id: '',
      markupContent: ''
    })
  }
}
