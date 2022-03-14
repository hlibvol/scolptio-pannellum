import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ExpenditureAddComponent } from './expenditure-add/expenditure-add.component';
import { ExpenditureDeleteComponent } from './expenditure-delete/expenditure-delete.component';
import { ExpenditureEditComponent } from './expenditure-edit/expenditure-edit.component';
import { ExpenditureListComponent } from './expenditure-list/expenditure-list.component';
import { ExpenditureService } from './expenditure.service';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ExpenditureListComponent,
    ExpenditureEditComponent,
    ExpenditureDeleteComponent
  ],
  imports: [
    SharedModule,
    QuillModule.forRoot(),
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path:'',
          component : ExpenditureListComponent,
        },
      ]),
  ],
  providers: [ExpenditureService]
})
export class ExpenditureModule { }

