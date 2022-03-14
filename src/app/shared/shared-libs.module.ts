import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

@NgModule({
    imports: [
        CKEditorModule,
        GalleryModule.withConfig({
            loadingStrategy: 'lazy'
        }),
        LightboxModule,
    ],
    exports: [
        CKEditorModule,
        GalleryModule,
        LightboxModule,
    ]
})
export class SharedLibsModule { }
