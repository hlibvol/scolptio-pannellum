import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { DetailsComponent } from './property-details-components/details/details.component';
import { PropertyDetailsSidebarComponent } from './property-details-sidebar/property-details-sidebar.component';
import { GisMapsComponent } from './property-details-components/gis-maps/gis-maps.component';
import { DueDeligenceComponent } from './property-details-components/due-deligence/due-deligence.component';
import { DocumentsComponent } from './property-details-components/documents/documents.component';
import { PropertyImportComponent } from './property-import/property-import.component';
import { PropertiesService } from './properties.service';
import { SharedModule } from '../../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { PropertyDocumentService } from './propertyDocument.service';
import { OrganizationService } from '../organizations/organization.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        SharedModule,
        QuillModule.forRoot(),
        RouterModule.forChild([
            {
                path: 'property-list',
                component: PropertyListComponent,
            },
            {
                path: 'property-details/:id',
                component: PropertyDetailComponent,
                children: [
                    {
                        path: 'overview',
                        loadChildren: () => import('./property-details-components/details/details.module').then(m => m.DetailsModule)
                    },
                    {
                        path: 'gis-maps',
                        loadChildren: () => import('./property-details-components/gis-maps/gis.module').then(m => m.GisModule)
                    },
                    {
                        path: 'images',
                        loadChildren: () => import('./property-details-components/images/image.module').then(m => m.ImageModule)
                    },
                    {
                        path: 'due-deligence',
                        loadChildren: () => import('./property-details-components/due-deligence/due-deligence.module').then(m => m.DueDeligenceModule)
                    },
                    {
                        path: 'documents',
                        loadChildren: () => import('./property-details-components/documents/documents.module').then(m => m.DocumentsModule)
                    },
                    {
                        path: 'Comparables',
                        loadChildren: () => import('./property-details-components/comparables/comparables.module').then(m => m.ComparablesModule)
                    },
                    {
                        path: 'county-planner',
                        loadChildren: () => import('./property-details-components/county-planner/county-planner.module').then(m => m.CountyPlannerModule)
                    },
                    {
                        path: 'marketing-details',
                        loadChildren: () => import('./property-details-components/marketing-details/marketing-details.module').then(m => m.MarketingDetailsModule)
                    },

                ]
            },
        ]),
        NgSelectModule
    ],
    declarations: [
        PropertyListComponent,
        DetailsComponent,
        PropertyDetailComponent,
        PropertyDetailsSidebarComponent,
        GisMapsComponent,
        DueDeligenceComponent,
        DocumentsComponent,

    ],
    providers: [PropertiesService,PropertyDocumentService,OrganizationService,BsModalService]
})

export class PropertiesModule { }