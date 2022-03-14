import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { IncomeAddComponent } from './income-add/income-add.component';
import { IncomeDeleteComponent } from './income-delete/income-delete.component';
import { IncomeEditComponent } from './income-edit/income-edit.component';
import { IncomeListComponent } from './income-list/income-list.component';
import { IncomeService } from './income.service';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    IncomeListComponent,
    IncomeEditComponent,
    IncomeDeleteComponent
  ],
  imports: [
    SharedModule,
    QuillModule.forRoot(),
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path:'',
          component : IncomeListComponent,
        },
      ]),
  ],
  providers: [IncomeService]
})
export class IncomeModule { }
