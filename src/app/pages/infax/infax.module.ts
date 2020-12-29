import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { InFaxComponent } from './infax-component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule, MatIconModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NbIconModule, NbCardModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  declarations: [
    InFaxComponent,
  ],
})
export class InFaxModule { }
