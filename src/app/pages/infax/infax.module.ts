import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { InFaxComponent } from './infax-component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule} from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatIconModule } from '@angular/material/icon';
import { NbIconModule, NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NbCardModule,
    FormsModule, 
    MatIconModule,
    ReactiveFormsModule,
    NbIconModule,
    MatButtonModule,
   TranslateModule
  ],
  declarations: [
    InFaxComponent,
  ],
})
export class InFaxModule{}
