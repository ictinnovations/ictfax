import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { InFaxComponent } from './infax-component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
    RouterModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatPaginatorModule,
    DropDownsModule,
    MatButtonModule,
  ],
  declarations: [
    InFaxComponent,
  ],
})
export class InFaxModule { }
