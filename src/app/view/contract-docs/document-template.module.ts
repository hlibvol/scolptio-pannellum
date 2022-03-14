import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentTemplatesListComponent } from './document-templates-list/document-templates-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { QuillModule } from 'ngx-quill';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/shared/settings.service';



@NgModule({
  declarations: [DocumentTemplatesListComponent],
  imports: [
  SharedModule,
  QuillModule.forRoot(),
    RouterModule.forChild([
      {
        path:'',
        component : DocumentTemplatesListComponent,
      },
    ]),
  ],
  providers: [
    BsModalService,
    SettingsService
  ]
})
export class DocumentTemplateModule { }
