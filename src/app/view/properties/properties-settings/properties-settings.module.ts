import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesSettingsComponent } from './properties-settings.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PropertiesSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'',
        component : PropertiesSettingsComponent,
      },
    ]),
  ]
})
export class PropertiesSettingsModule { }
