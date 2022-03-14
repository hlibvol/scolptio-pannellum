import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ListingsEditComponent } from './listings-edit/listings-edit.component';
import { ListingsListComponent } from './listings-list/listings-list.component';
import { ListingsAddComponent } from './listings-add/listings-add.component';
import { ListingsDeleteComponent } from './listings-delete/listings-delete.component';
import { SharedModule } from '../../shared/shared.module';
import { ListingService } from './listing.service';
import { RouterModule } from '@angular/router';
import { ListingImageComponent } from './listing-image/listing-image.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PropertiesService } from '../properties/properties.service';
import { ListingImageViewComponent } from './listing-image-view/listing-image-view.component';

@NgModule({
  declarations: [
    ListingsListComponent,
    ListingsEditComponent,
    ListingsDeleteComponent,
    ListingImageComponent,
    ListingImageViewComponent
  ],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        {
          path: '',
          component: ListingsListComponent,
        },
      ]),
  ],
  providers: [ListingService,PropertiesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListingModule { }
