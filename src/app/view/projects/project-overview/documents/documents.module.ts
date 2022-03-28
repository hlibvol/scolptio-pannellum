import { NgModule } from '@angular/core';
import { DocumentsComponent } from './documents.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DocumentsComponent,
      },
    ]),
  ]
})
export class DocumentsModule { }
