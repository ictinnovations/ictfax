import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { DefaultSettingsComponent } from './default_settings-component';
import { RouterModule } from '@angular/router';
import { NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    NbCardModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DefaultSettingsComponent,
  ],
})
export class DefaultSettingsModule { }
