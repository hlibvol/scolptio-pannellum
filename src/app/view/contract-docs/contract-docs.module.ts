import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractDocsListComponent } from './contract-docs-list/contract-docs-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ContractDocsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path:'',
        component : ContractDocsListComponent,
      },
    ]),
  ]
})
export class ContractDocsModule { }
