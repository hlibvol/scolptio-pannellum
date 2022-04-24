import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClientInviteComponent } from '../clients/client-invite/client-invite.component';
import { InvitationDeleteComponent } from './invitation-delete/invitation-delete.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { InvitationService } from './invitation.service';

@NgModule({
    declarations: [
        InvitationListComponent,
        InvitationDeleteComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: InvitationListComponent,
            },
        ]),
    ],
    providers: [InvitationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvitationModule { }
