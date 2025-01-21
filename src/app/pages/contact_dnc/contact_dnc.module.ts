import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbInputModule, NbOptionModule, NbSelectModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NbIconModule, } from '@nebular/theme';
import { ContactDNCRoutingModule, routedComponents, } from './contact_dnc-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { FileUploadModule, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    NbIconModule,
    ContactDNCRoutingModule,
    MatSortModule,
    FileUploadModule,
    TranslateModule,
    MatCardModule,
    MatDialogModule,
    NbInputModule,
    NbTreeGridModule,
    NbSelectModule,
    NbOptionModule,
    NbButtonModule,
  ],
  exports: [

  ]
})
export class ContactDNCModule { }
