import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ContactRoutingModule, routedComponents } from './contact-routing.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule, MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    ContactRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    FileUploadModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class ContactModule { }
