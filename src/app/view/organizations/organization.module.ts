import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationAddComponent } from './organization-add/organization-add.component';
import { OrganizationDeleteComponent } from './organization-delete/organization-delete.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationService } from './organization.service';

@NgModule({
  declarations: [
    OrganizationListComponent,
    OrganizationDeleteComponent,
    OrganizationAddComponent,
    OrganizationEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
          path: '',
          component: OrganizationListComponent,
        },
      ]),
  ],
  providers: [OrganizationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizationsModule { }
