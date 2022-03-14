
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SalesWebsiteListComponent } from './sales-website-list/sales-website-list.component';
import { SharedModule } from '../../shared/shared.module';
import { SalesWebsiteService } from './sales-website.service';
import { SalesWebsiteGenerateComponent } from './sales-website-generate/sales-website-generate.component';
import { SalesWebsiteEditComponent } from './sales-website-edit/sales-website-edit.component';
import { SalesWebsiteDeleteComponent } from './sales-website-delete/sales-website-delete.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { Template1Component } from './templates/template1/template1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FaqComponent } from './faq/faq.component';
import { ByPassSecurityPipe } from 'src/app/shared/pipes/Sanitize.pipe';

const maskConfig: Partial<IConfig> = {
  validation: true,
};
@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    QuillModule.forRoot(),
    RouterModule.forChild([
      {
        path: 'list',
        component: SalesWebsiteListComponent
      },
      {
        path: 'add',
        component: SalesWebsiteGenerateComponent
      },
      {
        path: 'edit/:id',
        component: SalesWebsiteGenerateComponent
      },
      // {
      //   path: 'edit',
      //   component: SalesWebsiteEditComponent
      // },
      {
        path: 'delete',
        component: SalesWebsiteDeleteComponent
      }
    ])
  ],
  declarations: [
    SalesWebsiteListComponent,
    SalesWebsiteGenerateComponent,
    SalesWebsiteEditComponent,
    SalesWebsiteDeleteComponent,
    Template1Component,
    FaqComponent,
    ByPassSecurityPipe

  ],
  providers: [SalesWebsiteService],
})
export class SalesWebsiteModule { }