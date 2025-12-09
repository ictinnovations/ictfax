import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { ChangePasswordComponent } from './changepassword-component';
import { RouterModule } from '@angular/router';
import { CheckValidator } from './password.check.directive';
import { NbButtonModule, NbCardModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    RouterModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbInputModule,
    NbTreeGridModule
  ],
  declarations: [
    CheckValidator,
    ChangePasswordComponent,
  ],
})
export class ChangePasswordModule { }
