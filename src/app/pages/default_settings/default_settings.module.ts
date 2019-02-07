import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DefaultSettingsComponent } from './default_settings-component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
    RouterModule,

  ],
  declarations: [
    DefaultSettingsComponent,
  ],
})
export class DefaultSettingsModule { }
