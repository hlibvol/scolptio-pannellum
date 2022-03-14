import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountyPlannerComponent } from './county-planner.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedLibsModule } from 'src/app/shared/shared-libs.module';



@NgModule({
  declarations: [CountyPlannerComponent],
  imports: [
    CommonModule,
    SharedLibsModule,
    RouterModule.forChild([
      {
        path:'',
        component : CountyPlannerComponent,
      },
    ]),
  ]
})
export class CountyPlannerModule { }
