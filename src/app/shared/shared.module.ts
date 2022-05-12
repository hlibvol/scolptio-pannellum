import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
import { PaginationComponent } from "./components/pagination/pagination.component";
import { DataService } from "./data-service";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { S3BucketService } from './s3-bucket.service';
import { MultiImageUploadComponent } from './components/multi-image-upload/multi-image-upload.component';
import { NgxCopperComponent } from './components/ngx-copper/ngx-copper.component';
import { DeleteComponent } from './components/delete/delete.component';
import { PropertyImportComponent } from '../view/properties/property-import/property-import.component';
import { ListingsAddComponent } from '../view/listings/listings-add/listings-add.component';
import { IncomeAddComponent } from '../view/income/income-add/income-add.component';
import { ExpenditureAddComponent } from '../view/expenditure/expenditure-add/expenditure-add.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { ModelUploadComponent } from './components/model-upload/model-upload.component';
import { TextureUploadComponent } from './components/texture-upload/texture-upload.component';
import { ClientInviteComponent } from '../view/clients/client-invite/client-invite.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
    imports: [
        SharedLibsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LeafletModule,
        NgSelectModule
    ],
    declarations: [
        PaginationComponent,
        ImageUploadComponent,
        ImageViewerComponent,
        DocumentUploadComponent,
        MultiImageUploadComponent,
        NgxCopperComponent,
        DeleteComponent,
        PropertyImportComponent,
        ListingsAddComponent,
        IncomeAddComponent,
        ExpenditureAddComponent,
        ModelUploadComponent,
        TextureUploadComponent,
        ClientInviteComponent
    ],
    providers: [DataService, S3BucketService],
    entryComponents: [],
    exports: [
        SharedLibsModule,
        PaginationComponent,
        ImageUploadComponent,
        ImageViewerComponent,
        DocumentUploadComponent,
        MultiImageUploadComponent,
        NgxCopperComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DeleteComponent,
        PropertyImportComponent,
        ListingsAddComponent,
        IncomeAddComponent,
        ExpenditureAddComponent,
        ModelUploadComponent,
        TextureUploadComponent,
        ClientInviteComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule { }
