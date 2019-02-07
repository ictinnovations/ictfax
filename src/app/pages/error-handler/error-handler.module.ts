import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { ErrorComponent } from './error-handler.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
    RouterModule,

  ],
  declarations: [
    ErrorComponent,
  ],
})
export class ErrorModule { }
